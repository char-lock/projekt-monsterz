interface LessonContent {
     contentType: number,
     contentText: string,
     correctAnswer?: string | undefined,
     genericAnswers?: string[] | undefined
}
export { LessonContent }