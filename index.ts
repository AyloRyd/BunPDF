#!/usr/bin/env bun
import { PDFDocument } from "pdf-lib";
import { $ } from "bun";

namespace CLI {
  export const help = () => {
    console.log(`
\x1b[1mbunpdf\x1b[0m - A fast CLI tool to merge PDF files.

\x1b[1mUsage:\x1b[0m
  bunpdf <input1.pdf> [input2.pdf ...] <output.pdf>

\x1b[1mOptions:\x1b[0m
  -h, --help    Show this help message

\x1b[1mEncrypted Files:\x1b[0m
  This tool automatically handles encrypted PDFs using \x1b[36mqpdf\x1b[0m.
  If you encounter blank pages or errors with secure files, ensure
  \x1b[36mqpdf\x1b[0m is installed and available in your system PATH.

  \x1b[2mInstall qpdf:\x1b[0m
  \x1b[2m- macOS:   brew install qpdf\x1b[0m
  \x1b[2m- Ubuntu:  sudo apt install qpdf\x1b[0m
  \x1b[2m- Fedora:  sudo dnf install qpdf\x1b[0m
  \x1b[2m- Arch:    sudo pacman -S qpdf\x1b[0m
  \x1b[2m- Windows: choco install qpdf\x1b[0m
`);
  };

  export const error = (error: unknown) => {
    console.error(
      "Error:",
      error instanceof Error ? error.message : String(error),
    );
    process.exit(1);
  };
}

namespace PDF {
  export const tryLoad = async (filePath: string) => {
    try {
      const fileBuffer = await Bun.file(filePath).arrayBuffer();
      return await PDFDocument.load(fileBuffer);
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes("encrypted")) {
        console.warn(
          `\x1b[33m${filePath} is encrypted. Decrypting with qpdf...\x1b[0m`,
        );

        try {
          const response = await $`qpdf --decrypt ${filePath} -`.quiet();

          if (response.exitCode !== 0) {
            throw new Error(`qpdf failed with exit code ${response.exitCode}`);
          }

          return await PDFDocument.load(response.arrayBuffer());
        } catch (qpdfError: unknown) {
          throw new Error(
            `Could not decrypt ${filePath}. Ensure 'qpdf' is installed and in your PATH.`,
          );
        }
      }
      throw error;
    }
  };
}

const main = async () => {
  const args = Bun.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    CLI.help();
    return;
  }

  if (args.length < 2) {
    console.error("Error: Provide at least one input and one output file.");
    process.exit(1);
  }

  const outputFile = args.pop()!;
  const inputFiles = args;

  console.log(`Merging ${inputFiles.length} files into ${outputFile}...`);

  try {
    const mergedPdf = await PDFDocument.create();

    for (const file of inputFiles) {
      const pdf = await PDF.tryLoad(file);

      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));

      console.log(`✔ Added ${file}`);
    }

    const mergedPdfBytes = await mergedPdf.save();
    await Bun.write(outputFile, mergedPdfBytes);

    console.log(`\n\x1b[1mSuccessfully created ${outputFile}\x1b[0m`);
  } catch (error: unknown) {
    CLI.error(error);
  }
};

main();
