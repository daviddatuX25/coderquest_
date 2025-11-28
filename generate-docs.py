#!/usr/bin/env python3
"""
CoderQuest Component Documentation Generator (Python Version)
Converts all React components and SCSS files to organized Markdown
Usage: python3 generate-docs.py
"""

import os
import sys
from pathlib import Path
from datetime import datetime

class DocGenerator:
    def __init__(self):
        self.output_dir = Path('./docs')
        self.output_file = 'CODERQUEST_COMPONENTS.md'
        self.src_dirs = {
            'components': Path('./src/components'),
            'hooks': Path('./src/hooks'),
            'styles': Path('./src/styles')
        }
        
        # Create output directory
        self.output_dir.mkdir(exist_ok=True)
    
    def read_file(self, file_path):
        """Read file content safely"""
        try:
            return file_path.read_text(encoding='utf-8')
        except Exception as e:
            print(f"⚠️  Error reading {file_path}: {e}")
            return ""
    
    def get_files(self, directory, extension):
        """Get all files with given extension from directory"""
        if not directory.exists():
            return []
        return sorted(directory.glob(f'*{extension}'))
    
    def generate_markdown(self):
        """Generate complete markdown documentation"""
        md = f"# CoderQuest - React Components & SCSS Documentation\n\n"
        md += f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
        
        # Table of Contents
        md += "## Table of Contents\n\n"
        md += "- [React Components](#react-components)\n"
        md += "- [Custom Hooks](#custom-hooks)\n"
        md += "- [SCSS Styles](#scss-styles)\n"
        md += "- [Summary](#summary)\n\n"
        
        # React Components
        md += self._generate_section(
            'React Components',
            'React components for the CoderQuest learning system.',
            self.src_dirs['components'],
            '.jsx'
        )
        
        # Custom Hooks
        md += self._generate_section(
            'Custom Hooks',
            'Custom React hooks for game integration and event handling.',
            self.src_dirs['hooks'],
            '.js'
        )
        
        # SCSS Styles
        md += self._generate_section(
            'SCSS Styles',
            'SCSS stylesheets organized by component.',
            self.src_dirs['styles'],
            '.scss'
        )
        
        # Summary
        md += self._generate_summary()
        
        return md
    
    def _generate_section(self, title, description, directory, extension):
        """Generate a documentation section"""
        files = self.get_files(directory, extension)
        
        md = f"---\n\n## {title}\n\n"
        md += f"{description}\n\n"
        
        if not files:
            md += f"*No {extension} files found in {directory}*\n\n"
            return md
        
        for idx, file_path in enumerate(files, 1):
            file_name = file_path.name
            content = self.read_file(file_path)
            
            md += f"### {idx}. {file_name}\n\n"
            md += f"**Path:** `{file_path}`\n\n"
            md += f"**Size:** {len(content)} bytes\n\n"
            md += f"```{self._get_language(extension)}\n"
            md += content
            md += f"\n```\n\n"
        
        return md
    
    def _get_language(self, extension):
        """Get syntax highlighting language for extension"""
        languages = {
            '.jsx': 'jsx',
            '.js': 'javascript',
            '.scss': 'scss',
            '.css': 'css'
        }
        return languages.get(extension, 'text')
    
    def _generate_summary(self):
        """Generate summary section"""
        comp_count = len(self.get_files(self.src_dirs['components'], '.jsx'))
        hook_count = len(self.get_files(self.src_dirs['hooks'], '.js'))
        scss_count = len(self.get_files(self.src_dirs['styles'], '.scss'))
        
        md = f"---\n\n## Summary\n\n"
        md += f"**Total React Components:** {comp_count}\n\n"
        md += f"**Total Custom Hooks:** {hook_count}\n\n"
        md += f"**Total SCSS Files:** {scss_count}\n\n"
        md += f"**Total Files:** {comp_count + hook_count + scss_count}\n\n"
        md += f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
        
        return md
    
    def save(self, content):
        """Save markdown to file"""
        output_path = self.output_dir / self.output_file
        output_path.write_text(content, encoding='utf-8')
        return output_path
    
    def generate(self):
        """Generate and save documentation"""
        print("🚀 Generating CoderQuest Component Documentation...\n")
        
        markdown = self.generate_markdown()
        output_path = self.save(markdown)
        
        print(f"✅ Documentation generated successfully!\n")
        print(f"📄 Output file: {output_path}\n")
        print(f"📊 Summary:")
        print(f"   - React Components: {len(self.get_files(self.src_dirs['components'], '.jsx'))}")
        print(f"   - Custom Hooks: {len(self.get_files(self.src_dirs['hooks'], '.js'))}")
        print(f"   - SCSS Files: {len(self.get_files(self.src_dirs['styles'], '.scss'))}")
        print(f"\n💡 Next steps:")
        print(f"   1. View the markdown: cat {output_path}")
        print(f"   2. Convert to PDF using pandoc:")
        print(f"      pandoc {output_path} -o {self.output_dir / 'CODERQUEST_COMPONENTS.pdf'}")
        print(f"   3. Or use VS Code's markdown preview extension\n")

if __name__ == '__main__':
    try:
        generator = DocGenerator()
        generator.generate()
    except Exception as e:
        print(f"❌ Error: {e}", file=sys.stderr)
        sys.exit(1)
