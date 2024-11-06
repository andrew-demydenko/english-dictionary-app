import { ref } from 'vue'

type Anchor =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top left'
  | 'top right'
  | 'bottom left'
  | 'bottom right'

interface SnackbarOptions {
  message: string
  color?: string
  timeout?: number
  position?: Anchor
  multiLine?: boolean
  buttonText?: string
  onClose?: (() => void) | null
}

const snackbar = ref<SnackbarOptions & { visible: boolean }>({
  visible: false,
  message: '',
  color: 'success',
  timeout: 3000,
  position: 'top',
  multiLine: false,
  buttonText: 'Close',
  onClose: null,
})

export const showSnackbar = ({
  message,
  color = 'success',
  timeout = 3000,
  position = 'top',
  multiLine = false,
  buttonText = 'Close',
  onClose = null,
}: SnackbarOptions) => {
  snackbar.value.message = message
  snackbar.value.color = color
  snackbar.value.timeout = timeout
  snackbar.value.position = position
  snackbar.value.multiLine = multiLine
  snackbar.value.buttonText = buttonText
  snackbar.value.onClose = onClose
  snackbar.value.visible = true
}

export const useSnackbar = () => snackbar
