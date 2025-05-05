import PocketBase from "pocketbase";
import { readdir, readFile } from "fs/promises";
import { join } from "path";

const pb = new PocketBase("https://bibletype-pb.raywang.dev/"); // Update with your URL

async function uploadTestament(booksDir, testament) {
  // 1. Get all book JSON files
  const files = await readdir(booksDir);

  for (const file of files) {
    if (!file.endsWith(".json")) continue;

    const filePath = join(booksDir, file);
    const bookData = JSON.parse(await readFile(filePath, "utf-8"));

    // 2. Create bible_books record
    const bookName = bookData.book.includes("--") ? bookData.book.split("--")[1] : bookData.book;
    const bookExists = await pb
      .collection("bible_books")
      .getFirstListItem(
        `name = "${bookName}"`,
        { silent: true }, // Suppress "not found" errors
      )
      .catch(() => null);

    if (bookExists) {
      console.log(`${bookName} exists, skipped.`);
      continue;
    }

    const bookRecord = await pb.collection("bible_books").create({
      name: bookName,
      testament: testament,
      ordered_id: bookData.book_order,
    });

    console.log(`Created book: ${bookRecord.name}`);

    // 3. Create bible (verses) records
    for (const chapter of bookData.chapters) {
      for (const verse of chapter.verses) {
        const verseExists = await pb
          .collection("bible")
          .getFirstListItem(
            `book = "${bookRecord.id}" && chapter = ${chapter.chapter} && verse = ${verse.verse}`,
            { silent: true }, // Suppress "not found" errors
          )
          .catch(() => null);

        if (!verseExists) {
          await pb.collection("bible").create({
            book: bookRecord.id,
            chapter: chapter.chapter,
            verse: verse.verse,
            text: verse.text,
          });
        } else {
          console.log(
            `${bookName} chapter ${chapter.chapter} verse ${verse.verse} exists, skipped.`,
          );
        }
      }
    }

    console.log(`Uploaded ${bookRecord.name} (${bookData.chapters.length} chapters)`);
  }
}

async function uploadBibleData() {
  try {
    // 1. Login as admin
    await pb.admins.authWithPassword("admin@raywang.dev", "123123123");

    // 2. Upload old and new testaments
    uploadTestament("./Bible/OT", "OT");
    uploadTestament("./Bible/NT", "NT");
  } catch (err) {
    console.error("Error:", err);
  }

  console.log("All books uploaded!");
}

// Run the upload
uploadBibleData();
