import type { QuizFormType } from "@/schema/quizFormSchema"
import { Plus, Trash2 } from "lucide-react"
import { Controller, useFieldArray, type Control } from "react-hook-form"
import { Button } from "../ui/button"
import { Field, FieldError } from "../ui/field"
import { Input } from "../ui/input"

export const MCQForm = ({
  control,
  questionIndex,
}: {
  control: Control<QuizFormType>
  questionIndex: number
}) => {
  const {
    fields: optionFields,
    append: appendFieldOption,
    remove: removeFieldOption,
  } = useFieldArray({
    name: `questions.${questionIndex}.options`,
    control,
  })

  const addChoice = () => {
    appendFieldOption({ value: "" }, { shouldFocus: true })
  }

  const removeChoice = (qIndex: number) => {
    removeFieldOption(qIndex)
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Choices (click radio to set correct answer):
      </p>
      {optionFields.map((_optionField, optionIndex: number) => (
        <div key={optionIndex} className="flex items-start gap-2">
          <Controller
            name={`questions.${questionIndex}.correctAnswer`}
            control={control}
            render={({ field }) => (
              <>
                <button
                  type="button"
                  onClick={() => {
                    field.onChange(optionIndex.toString())
                  }}
                  className={`mt-2.5 h-5 w-5 shrink-0 cursor-pointer rounded-full border-2 transition-colors ${
                    field.value === optionIndex.toString()
                      ? "border-primary bg-primary"
                      : "border-muted-foreground"
                  }`}
                />
              </>
            )}
          />

          <Controller
            name={`questions.${questionIndex}.options.${optionIndex}.value`}
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Field data-invalid={fieldState.invalid}>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="Option title"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              </>
            )}
          />
          {optionFields.length > 2 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeChoice(optionIndex)}
              className="mt-1"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => addChoice()}
      >
        <Plus className="mr-1 h-3 w-3" /> Add choice
      </Button>
    </div>
  )
}
