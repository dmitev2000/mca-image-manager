export class CustomError extends Error {
  constructor(public message: string, public status: number) {
    super(message);
  }
}

export const EvaluateErrorMessage = (
  message: string,
  status: number
): string => {
  if (status === 400) {
    return 'Bad request.';
  } else if (status === 404) {
    return 'Resource not found.';
  } else {
    return 'Something went wrong.';
  }
};
