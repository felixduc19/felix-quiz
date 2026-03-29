import type { QuizFormType } from "@/schema/quizFormSchema"
import { Controller, type Control } from "react-hook-form"
import { Input } from "../ui/input"
import { Field, FieldError } from "../ui/field"

const ShortQuestionForm = ({
  questionIndex,
  control,
}: {
  questionIndex: number
  control: Control<QuizFormType>
}) => {
  return (
    <div>
      <Controller
        name={`questions.${questionIndex}.correctAnswer`}
        control={control}
        render={({ field, fieldState }) => (
          <>
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                placeholder="Correct answer (case-insensitive match)"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          </>
        )}
      />
    </div>
  )
}

export default ShortQuestionForm
