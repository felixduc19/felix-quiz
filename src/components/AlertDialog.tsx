import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { type PropsWithChildren } from "react"

interface AlertDialogProps extends PropsWithChildren {
  onClick: () => void
  title: string
  description: string
  alertDialogTriggerClassName?: string
}

export const CustomAlertDialog = ({
  title,
  description,
  onClick,
  children,
  alertDialogTriggerClassName,
}: AlertDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild className={alertDialogTriggerClassName}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onClick}>Exit Quiz</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
