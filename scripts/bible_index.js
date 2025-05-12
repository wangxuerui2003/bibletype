import { readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";

async function indexTestament(booksDir, testament) {
  let testamentContent = [];
  const files = await readdir(booksDir);

  for (const file of files) {
    if (!file.endsWith(".json")) continue;

    const filePath = join(booksDir, file);
    const bookData = JSON.parse(await readFile(filePath, "utf-8"));

    const bookName = bookData.book.includes("--") ? bookData.book.split("--")[1] : bookData.book;
    const bookOrderedId = bookData.book_order;
    let chapters = [];

    for (const chapter of bookData.chapters) {
      chapters.push({
        number: chapter.chapter,
        verses: chapter.verses.length,
      });
    }

    testamentContent.push({
      book: bookName,
      ordered_id: bookOrderedId,
      chapters: chapters,
    });
  }

  return testamentContent;
}

async function indexBible() {
  let bible = {};
  try {
    bible.OT = await indexTestament("./Bible/OT", "OT");
    bible.NT = await indexTestament("./Bible/NT", "NT");
  } catch (err) {
    console.error("Error:", err);
  }

  await writeFile("bible.json", JSON.stringify(bible, null, 2));
}

indexBible();
