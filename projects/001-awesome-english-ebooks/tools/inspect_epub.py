"""Audit local EPUB structure without extracting or publishing article text.

Usage: python tools/inspect_epub.py INPUT.epub --output report.json
Python 3.10+, standard library only. No downloading or format conversion.
"""
import argparse
import hashlib
import json
import pathlib
import posixpath
import zipfile
import xml.etree.ElementTree as ET
from collections import Counter
from html.parser import HTMLParser
from urllib.parse import urlparse, unquote

def audit(source):
    source = pathlib.Path(source)
    domains = Counter()
    with zipfile.ZipFile(source) as package:
        names = package.namelist()
        if len(names) > 20000 or sum(i.file_size for i in package.infolist()) > 250_000_000:
            raise ValueError('Package exceeds audit limits')
        def xml(name):
            if package.getinfo(name).file_size > 8_000_000:
                raise ValueError('XML exceeds audit limit: ' + name)
            raw = package.read(name)
            if b'<!ENTITY' in raw:
                raise ValueError('Entity declarations are unsupported')
            return ET.fromstring(raw)
        container = xml('META-INF/container.xml')
        opfs = [n.get('full-path') for n in container.iter() if n.tag.split('}')[-1] == 'rootfile']
        if not opfs: raise ValueError('Missing OPF rootfile')
        reports = []
        for opf in opfs:
            doc = xml(opf)
            metadata, manifest, spine = [], {}, []
            for node in doc.iter():
                tag = node.tag.split('}')[-1]
                if tag in ('title', 'language', 'creator', 'publisher'):
                    metadata.append({'key': tag, 'value': node.text})
                if tag == 'meta' and 'calibre' in str(node.attrib):
                    metadata.append({'key': 'meta', 'attributes': node.attrib})
                if tag == 'item': manifest[node.get('id')] = node.get('href', '')
                if tag == 'itemref': spine.append(node.get('idref'))
            resolved = []
            for identifier in spine:
                if identifier not in manifest: raise ValueError('Missing manifest ID: ' + str(identifier))
                relative = unquote(urlparse(manifest[identifier]).path)
                internal = posixpath.normpath(posixpath.join(posixpath.dirname(opf), relative))
                if internal not in names: raise ValueError('Missing spine document: ' + internal)
                resolved.append(internal)
            reports.append({'opf': opf, 'metadata': metadata, 'spineItems': len(spine), 'resolvedSpineItems': len(resolved)})
        parse_errors = []
        class LinkParser(HTMLParser):
            def handle_starttag(self, tag, attrs):
                href = dict(attrs).get('href', '') or ''
                if href.startswith(('http://', 'https://')):
                    domains[urlparse(href).netloc] += 1
        for name in names:
            if not name.endswith(('.html', '.htm', '.xhtml')): continue
            try: xml(name)
            except ET.ParseError:
                parse_errors.append(name)
            # Preserve XML quality warnings; count links with a tolerant HTML parser.
            parser = LinkParser(convert_charrefs=True)
            parser.feed(package.read(name).decode('utf-8-sig'))
            parser.close()
        return {
            'file': source.name, 'bytes': source.stat().st_size,
            'sha256': hashlib.sha256(source.read_bytes()).hexdigest(),
            'zipEntries': len(names), 'packages': reports,
            'linkDomains': dict(domains.most_common()),
            'htmlParseErrors': parse_errors,
            'linkParser': 'stdlib HTMLParser; includes duplicate, navigation and reference links',
            'limits': 'Package-level metadata and link counts only; not article attribution or content quality.'
        }

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('input')
    parser.add_argument('--output', required=True)
    args = parser.parse_args()
    result = audit(args.input)
    pathlib.Path(args.output).write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print('Audit written to ' + args.output)
