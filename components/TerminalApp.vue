<template>
  <div class="terminal-app w-full h-full flex flex-col bg-black text-white p-2 font-mono text-sm overflow-hidden" @click="focusInput">
    <div class="terminal-output flex-1 overflow-y-auto mb-2" ref="outputRef">
      <div v-for="(line, i) in history" :key="i" class="whitespace-pre-wrap leading-tight">
        <span v-if="line.type === 'prompt'" class="text-green-400">{{ line.path }}> </span>
        <span :class="line.type === 'error' ? 'text-red-500' : ''">{{ line.text }}</span>
      </div>
    </div>
    
    <div class="terminal-input-line flex items-center">
      <span class="text-white mr-2">{{ currentPathStr }}></span>
      <input
        ref="inputRef"
        v-model="commandInput"
        type="text"
        class="flex-1 bg-transparent border-none outline-none text-white font-mono lowercase"
        autofocus
        @keydown.enter="executeCommand"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'

interface FSNode {
  name: string
  type: 'dir' | 'file'
  children?: FSNode[]
}

interface HistoryLine {
  text: string
  type: 'text' | 'prompt' | 'error'
  path?: string
}

const history = ref<HistoryLine[]>([
  { text: 'Marcelos(R) Windows 98 Terminal', type: 'text' },
  { text: '', type: 'text' },
  { text: 'Type "help" for available commands.', type: 'text' },
  { text: '', type: 'text' }
])

const commandInput = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const outputRef = ref<HTMLElement | null>(null)

// File System em memória (Sessão)
const fs = reactive<FSNode>({
  name: 'C:',
  type: 'dir',
  children: [
    { name: 'windows', type: 'dir', children: [] },
    { name: 'user', type: 'dir', children: [
      { name: 'desktop', type: 'dir', children: [] }
    ]},
  ]
})

const currentPath = ref<FSNode[]>([fs]) // Breadcrumbs

const currentPathStr = computed(() => {
  return currentPath.value.map(n => n.name).join('\\').toUpperCase()
})

const currentDir = computed(() => {
  return currentPath.value[currentPath.value.length - 1]
})

function focusInput() {
  inputRef.value?.focus()
}

function scrollToBottom() {
  nextTick(() => {
    if (outputRef.value) {
      outputRef.value.scrollTop = outputRef.value.scrollHeight
    }
  })
}

async function executeCommand() {
  const fullCmd = commandInput.value.trim()
  if (!fullCmd) return

  // Adicionar ao histórico
  history.value.push({ text: fullCmd, type: 'prompt', path: currentPathStr.value })
  
  const [cmd, ...args] = fullCmd.split(' ')
  
  switch (cmd.toLowerCase()) {
    case 'ls':
    case 'dir':
      const items = currentDir.value.children?.map(n => n.name) || []
      if (items.length === 0) {
        history.value.push({ text: '(vazio)', type: 'text' })
      } else {
        history.value.push({ text: items.join('  '), type: 'text' })
      }
      break

    case 'cd':
      const target = args[0]
      if (!target) break
      
      if (target === '..') {
        if (currentPath.value.length > 1) {
          currentPath.value.pop()
        }
      } else if (target === '/') {
         currentPath.value = [fs]
      } else {
        const found = currentDir.value.children?.find(n => n.name === target && n.type === 'dir')
        if (found) {
          currentPath.value.push(found)
        } else {
          history.value.push({ text: `Diretório não encontrado: ${target}`, type: 'error' })
        }
      }
      break

    case 'mkdir':
      const name = args[0]
      if (!name) {
        history.value.push({ text: 'Uso: mkdir <nome>', type: 'error' })
        break
      }
      if (!currentDir.value.children) currentDir.value.children = []
      
      if (currentDir.value.children.some(n => n.name === name)) {
        history.value.push({ text: `Erro: "${name}" já existe.`, type: 'error' })
      } else {
        currentDir.value.children.push({ name, type: 'dir', children: [] })
      }
      break

    case 'clear':
    case 'cls':
      history.value = []
      break

    case 'help':
      history.value.push({ text: 'Comandos disponíveis:', type: 'text' })
      history.value.push({ text: '  ls, dir    - Listar arquivos', type: 'text' })
      history.value.push({ text: '  cd <dir>   - Mudar diretório', type: 'text' })
      history.value.push({ text: '  mkdir <n>  - Criar diretório', type: 'text' })
      history.value.push({ text: '  cls, clear - Limpar tela', type: 'text' })
      history.value.push({ text: '  help       - Mostrar esta ajuda', type: 'text' })
      break

    default:
      history.value.push({ text: `'${cmd}' não é reconhecido como um comando interno ou externo.`, type: 'error' })
  }

  commandInput.value = ''
  scrollToBottom()
}

onMounted(() => {
  focusInput()
})
</script>

<style scoped>
.terminal-app {
  cursor: text;
}
.terminal-output {
  scrollbar-width: thin;
  scrollbar-color: #555 #000;
}
.terminal-output::-webkit-scrollbar {
  width: 8px;
}
.terminal-output::-webkit-scrollbar-track {
  background: #000;
}
.terminal-output::-webkit-scrollbar-thumb {
  background: #555;
  border: 1px solid #000;
}
input {
  caret-color: white;
}
</style>
