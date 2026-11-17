import { globalIgnores } from 'eslint/config'
import { config } from '@repo/stephen-eslint-config/base'

export default [...config, globalIgnores(['apps/**', 'packages/**'])]
