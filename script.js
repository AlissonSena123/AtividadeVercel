import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = "https://gtkvoyjsaivikqolrxpk.supabase.co"
const SUPABASE_KEY = "sb_publishable_Fo2iPtn6x8dXIjcHI5TZxg_h5pDH_TR"

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const form = document.getElementById('formFerramenta')
const lista = document.getElementById('listaFerramentas')

let editandoId = null

// Ler a tabela (READ)
async function listarFerramentas() {
  const { data, error } = await supabase
    .from('Ferramentas')
    .select("*")

  if (error) {
    console.error(error)
    return
  }

  lista.innerHTML = ''

  data.forEach(f => {
    const li = document.createElement('li')

    li.innerHTML = `
      <strong>${f.nome}</strong> - ${f.tipo} (${f.quantidade})
      <br>
      <small>${f.descricao || ''}</small>
      <br>
      <button data-acao="editar" data-id="${f.id}">Editar</button> 
      <button data-acao="deletar" data-id="${f.id}">Excluir</button>
    `

    lista.appendChild(li)
  })
}

// Cadastrar itens (CREATE)
async function criarFerramenta(ferramenta) {
  const { error } = await supabase
    .from('Ferramentas')
    .insert([ferramenta])

  if (error) {
    console.error(error)
    return false
  }

  return true
}

// Atualizar itens (UPDATE)
async function atualizarFerramenta(id, ferramenta) {
  const { error } = await supabase
    .from('Ferramentas')
    .update(ferramenta)
    .eq('id', id)

  if (error) {
    console.error(error)
    return false
  }

  return true
}

// Deletar itens (DELETE)
async function deletarFerramenta(id) {
  const { error } = await supabase
    .from('Ferramentas')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(error)
    return false
  }

  return true
}


form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const formData = new FormData(form)

  const ferramenta = {
    nome: formData.get('nome'),
    tipo: formData.get('tipo'),
    quantidade: Number(formData.get('quantidade')),
    descricao: formData.get('descricao')
  }

  let sucesso

  if (editandoId) {
    sucesso = await atualizarFerramenta(editandoId, ferramenta)
    editandoId = null
    form.querySelector('button').textContent = "Cadastrar"
  } else {
    sucesso = await criarFerramenta(ferramenta)
  }

  if (!sucesso) return

  form.reset()
  listarFerramentas()
})

lista.addEventListener('click', async (e) => {
  const botao = e.target // Elemento Clicado
  const id = botao.dataset.id
  const acao = botao.dataset.acao

  if (!id) return

  // DELETE
  if (acao === 'deletar') {
    const sucesso = await deletarFerramenta(id)
    if (sucesso) listarFerramentas()
  }

  // EDITAR
  if (acao === 'editar') {
    const { data, error } = await supabase
      .from('Ferramentas')
      .select()
      .eq('id', id)
      .single()

    if (error) {
      console.error(error)
      return
    }

    form.nome.value = data.nome
    form.tipo.value = data.tipo
    form.quantidade.value = data.quantidade
    form.descricao.value = data.descricao

    editandoId = id
    form.querySelector('button').textContent = "Atualizar"
  }
})

// inicializa
listarFerramentas()