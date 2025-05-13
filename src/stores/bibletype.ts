import { defineStore } from "pinia";

export const useBTStore = defineStore("bibletype", {
  state: () => ({
    currentVerse: "",
    words: [] as { text: string; completed: boolean; typed: string }[],
    currentIndex: 0,
    isComplete: false,
    statistics: {
      accuracy: 0,
      wpm: 0,
    },
    startTime: null as Date | null,
    elapsedSeconds: 0,
    timerInterval: null as number | null,
  }),

  getters: {
    formattedTime(): string {
      const mins = Math.floor(this.elapsedSeconds / 60);
      const secs = this.elapsedSeconds % 60;
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    },

    wpm(): number {
      // Calculate total correctly typed characters
      const correctChars = this.words.reduce((acc, word) => {
        return (
          acc +
          [...word.text].filter((char, i) => i < word.typed.length && char === word.typed[i]).length
        );
      }, 0);

      // Calculate total typed characters (correct + incorrect)
      const totalTypedChars = this.words.reduce((acc, word) => acc + word.typed.length, 0);

      // Use either the elapsed time or time since first keystroke
      const minutes = Math.max(1, this.elapsedSeconds) / 60;

      // Raw speed: (totalTypedChars / 5) / minutes
      // Accuracy-adjusted: (correctChars / 5) / minutes
      return Math.round(correctChars / 5 / minutes);
    },
  },

  actions: {
    async init(verseText: string) {
      const map = {
        "“": '"',
        "”": '"',
        "’": "'",
        "‘": "'",
      };
      this.currentVerse = verseText.trim().replace(/[“”’‘]/gu, (match) => map[match] || match);
      this.words = this.currentVerse.split(/\s+/).map((word) => ({
        text: word,
        completed: false,
        typed: "",
      }));
      this.currentIndex = 0;
      this.isComplete = false;
      this.startTime = null;
      this.elapsedSeconds = 0;
      this.timerInterval = null;
    },

    updateTypedWord(typed: string) {
      if (!this.startTime) this.startTimer();

      const word = this.words[this.currentIndex];
      word.typed = typed;
      // word.completed = typed === word.text;
    },

    moveToNextWord() {
      const word = this.words[this.currentIndex];
      word.completed = word.typed === word.text;
      if (this.currentIndex < this.words.length - 1) {
        this.currentIndex++;
      } else {
        this.calculateStatistics();
        this.isComplete = true;
        this.stopTimer();
      }
    },

    moveToPreviousWord() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        // Reset current word's completion status
        this.words[this.currentIndex].completed = false;
      }
    },

    calculateStatistics() {
      const correctChars = this.words.reduce((acc, word) => {
        return (
          acc +
          [...word.text].filter((char, i) => i < word.typed.length && char === word.typed[i]).length
        );
      }, 0);

      const totalTypedChars = this.words.reduce((acc, word) => acc + word.typed.length, 0);

      this.statistics.accuracy = totalTypedChars > 0 ? (correctChars / totalTypedChars) * 100 : 0;
    },

    async uploadStatistics() {
      // API call to save stats
    },

    startTimer() {
      if (!this.startTime) {
        this.startTime = new Date();
        this.timerInterval = setInterval(() => {
          this.elapsedSeconds = Math.floor(
            (new Date().getTime() - this.startTime!.getTime()) / 1000
          );
        }, 1000);
      }
    },

    stopTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    },
  },
});
