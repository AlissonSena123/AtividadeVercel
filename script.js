import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = "https://gtkvoyjsaivikqolrxpk.supabase.co"
const SUPABASE_KEY = "sb_publishable_Fo2iPtn6x8dXIjcHI5TZxg_h5pDH_TR"

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const form = document.getElementById('formFerramenta')
const lista = document.getElementById('listaFerramentas')

// Função para listar ferramentas
async function listarFerramentas() {
  const { data, error } = await supabase.from('Ferramentas').select()
  if(error) {
    console.error(error)
    return
  }

  lista.innerHTML = ''
  data.forEach(f => {
    const li = document.createElement('li')
    li.textContent = `${f.nome} - ${f.tipo} - ${f.quantidade}`
    lista.appendChild(li)
  })
}

// Evento de envio do formulário
form.addEventListener('submit', async e => {
  e.preventDefault()
  const formData = new FormData(form)
  const ferramenta = {
    nome: formData.get('nome'),
    tipo: formData.get('tipo'),
    quantidade: Number(formData.get('quantidade')),
    descricao: formData.get('descricao')
  }

  const { error } = await supabase.from('Ferramentas').insert([ferramenta])
  if(error) {
    console.error(error)
    return
  }

  form.reset()
  listarFerramentas()
})

// Carrega a lista ao abrir a página
listarFerramentas()