# bunpdf

A fast, lightweight CLI tool to merge PDF files, built with [Bun](https://bun.com) and TypeScript.

It automatically handles standard PDF merging and includes intelligent fallback support for **encrypted PDFs** using `qpdf`.

## Features

- **Fast merging:** uses `pdf-lib` for high-performance PDF manipulation.
- **Encrypted support:** automatically detects encrypted files and decrypts them on-the-fly (requires `qpdf`).
- **Simple CLI:** easy-to-use syntax similar to standard Unix tools.
- **Zero-config:** no complex setup required beyond dependencies.

## Installation & Setup

### 1. Prerequisites

You must have **Bun** installed:

```bash
curl -fsSL https://bun.sh/install | bash
```

For encrypted PDF support, you must have **qpdf** installed:

- **macOS:** `brew install qpdf`
- **Ubuntu/Debian:** `sudo apt install qpdf`
- **Fedora:** `sudo dnf install qpdf`
- **Arch:** `sudo pacman -S qpdf`
- **Windows:** `choco install qpdf`

### 2. Install project dependencies

Clone this repository and install the required packages:

```bash
bun install
```

### 3. Make it executable (global usage)

To use `bunpdf` as a global command in your terminal from any directory:

1. **Link the package:**
   run this command in the project root directory:

```bash
bun link
```

2. **Verify installation:**
   now you can type `bunpdf` anywhere:

```bash
bunpdf --help
```

_(Alternatively, to run it locally without linking, use `bun run index.ts ...`)_

## Usage

The basic syntax requires at least one input file and one output file. The **last argument** is always the output destination.

```bash
bunpdf <input1.pdf> [input2.pdf ...] <output.pdf>
```
