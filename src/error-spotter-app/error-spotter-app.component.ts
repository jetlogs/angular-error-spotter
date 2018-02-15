import * as _ from "lodash";
import { Component } from "@angular/core";
import { ErrorSpotterStateService } from "./error-spotter-state.service";
import { ErrorSpotterProgressService } from "./error-spotter-progress.service";
import { TEST_SENTENCES } from "../test-data/test-sentences";
import { ErrorSpotterAnswer, SentenceDisplay } from "./sentence";


@Component({
    selector: "ec-error-spotter-app",
    templateUrl: "error-spotter-app.component.html",
    styleUrls: ["error-spotter-app.component.css"]
})
export class ErrorSpotterAppComponent {
    private selectedIndex?: number;
    private checked: boolean = false;
    private correct: boolean = false;

    constructor(
        private errorSpotterStateService: ErrorSpotterStateService,
        private errorSpotterProgressService: ErrorSpotterProgressService) {
        this.initialize();
    }

    initialize(): void {
        this.errorSpotterStateService.setSentences(TEST_SENTENCES);
    }

    reset(): void {
        this.checked = false;
        this.selectedIndex = undefined;
    }

    isStarted(): boolean {
        return this.errorSpotterStateService.isStarted();
    }

    isCompleted(): boolean {
        return this.errorSpotterStateService.isCompleted();
    }

    startQuiz(): void {
        this.errorSpotterStateService.startQuiz();
        this.errorSpotterProgressService.startSession();
    }

    getCurrentSentence(): SentenceDisplay | undefined {
        return this.errorSpotterStateService.getCurrentSentenceDisplay();
    }

    isErrorTypeDeletion(): boolean {
        return this.errorSpotterStateService.isErrorTypeDeletion();
    }

    isErrorTypeSubstitution(): boolean {
        return this.errorSpotterStateService.isErrorTypeSubstitution();
    }

    selectDisplayWord(index: number): void {
        if (this.isChecked()) {
            return;
        }
        this.selectedIndex = index;
    }

    getSelectedIndex(): number | undefined {
        return this.selectedIndex;
    }

    hasSelected(): boolean {
        return !_.isUndefined(this.selectedIndex);
    }

    isSelected(index: number): boolean {
        return this.selectedIndex === index;
    }

    checkAnswer(): void {
        if (!this.hasSelected()) {
            return;
        }

        this.checked = true;

        let selectedWord = this.errorSpotterStateService.getDisplayWordByIndex(this.selectedIndex);
        this.correct = selectedWord.distractor === true;
        this.errorSpotterProgressService.answer(
            this.getCurrentSentence(),
            selectedWord,
            this.selectedIndex,
            this.correct
        );
    }

    isChecked(): boolean {
        return this.checked;
    }

    isCorrect(): boolean {
        return this.correct;
    }

    nextQuestion(): void {
        if (!this.isChecked()) {
            return;
        }
        this.reset();
        let nextSentence = this.errorSpotterStateService.generateNextSentence();
        if (!nextSentence) {
            this.errorSpotterProgressService.endSession();
        }
    }

    getSessionTime(): string {
        return this.errorSpotterProgressService.getSessionTime();
    }

    getAnswers(): ErrorSpotterAnswer[] {
        return this.errorSpotterProgressService.getAnswers();
    }

    getTotalCorrectAnswers(): number {
        return this.errorSpotterProgressService.getTotalCorrectAnswers();
    }
}
