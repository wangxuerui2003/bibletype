import { defineStore } from "pinia";
import { BIBLE_INDEX } from "@/utils/bible-index";
import pocketbase from "@/lib/pocketbase";

interface UserProgress {
  id: string;
  user: string; // user id
  testament: "OT" | "NT";
  book: string;
  chapter: number;
  verse: number;
  updated: string;
}

interface BibleVerseRecord {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  updated: string;
}

export const useProgressStore = defineStore("progress", {
  state: () => ({
    currentProgress: {} as UserProgress,
    currentVerse: "",
  }),
  getters: {
    getCurrentVerse: (state) => state.currentVerse,
  },
  actions: {
    async init() {
      // Initial fetch the user current progress
      try {
        const progress = (await pocketbase
          .collection("user_progress")
          .getFirstListItem(`user = "${pocketbase.authStore.record?.id}"`)) as UserProgress;

        this.currentProgress = progress;
        await this.updateCurrentVerse();
      } catch (err) {
        console.error("Failed to fetch user progress:", err);
      }
    },
    async incrementProgress() {
      if (Object.keys(this.currentProgress).length === 0) {
        return;
      }

      const progressData = {
        user: this.currentProgress.user,
        testament: this.currentProgress.testament,
        book: this.currentProgress.book,
        chapter: this.currentProgress.chapter,
        verse: this.currentProgress.verse,
      };
      const testament: "OT" | "NT" = progressData.testament || "OT";
      const bookIndex = BIBLE_INDEX[testament].findIndex((obj) => {
        return obj.book.toLowerCase() == progressData.book.toLowerCase();
      });
      const book = bookIndex !== -1 ? BIBLE_INDEX[testament][bookIndex] : undefined;

      if (!book) {
        // should not happen, just to eliminate ts errors
        return;
      }

      const chapters = book.chapters.length;
      const chapter = book.chapters[progressData.chapter - 1];

      // if on last verse of the chapter
      if (progressData.verse == chapter.verses) {
        // if on last chapter of the book
        if (progressData.chapter == chapters) {
          // go to next book chapter 1 verse 1
          // if on Old testament last book
          if (testament == "OT" && book.ordered_id == 39) {
            progressData.testament = "NT";
            progressData.book = BIBLE_INDEX.NT[0].book;
          } else {
            progressData.book = BIBLE_INDEX[testament][bookIndex + 1].book;
          }
          progressData.chapter = 1;
          progressData.verse = 1;
        } else {
          progressData.chapter++;
          progressData.verse = 1;
        }
      } else {
        progressData.verse++;
      }

      const updatedProgress = (await pocketbase
        .collection("user_progress")
        .update(this.currentProgress.id, progressData)) as UserProgress;
      this.currentProgress = updatedProgress;
    },
    async updateCurrentVerse() {
      const book = await pocketbase
        .collection("bible_books")
        .getFirstListItem(`name = "${this.currentProgress.book}"`);
      const verse: BibleVerseRecord = await pocketbase
        .collection("bible")
        .getFirstListItem(
          `book = "${book.id}" && chapter = "${this.currentProgress.chapter}" && verse = "${this.currentProgress.verse}"`
        );
      this.currentVerse = verse.text;
    },
  },
});
