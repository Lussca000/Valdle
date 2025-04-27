// definir dicionarios
let agentes = []
let agenteAtual = null
let agentesUsados = []
// pegando os elementos (dom da pag)
const imagemAgente = document.getElementById("agente-img")
const verificar = document.getElementById("verificar")
const feedback = document.getElementById("feedback")
const resposta = document.getElementById("resposta")
//inicializar o script apos carregar a pag
document.addEventListener('DOMContentLoaded', iniciarJogo);
async function iniciarJogo() {
    await buscarAgentes()
    mostrarProxAgente()
    resposta.addEventListener("keydown", function(event){
        if (event.key==="Enter"){
            verificarResposta(event)
        }
    })
}
/* crio uma funcão que busca os agentes usando a API, response usa para requisitar o api
*/
async function buscarAgentes() {
    try {
        const apiUrl = "https://valorant-api.com/v1/agents?language=pt-BR&isPlayableCharacter=true"
        const response = await fetch(apiUrl)
        
        const data = await response.json()
        
        if (data.status !==200) {
            console.log('falha na api')
        } 
        agentes = data.data
            .filter(agente => agente.displayIcon)
            .map(agente => {
                return {
                    uuid: agente.uuid,
                    nome: agente.displayName,
                    icone: agente.displayIcon
                };
            });
        return true;
    } catch(erro){
        console.log('erro')
        return false
    }  
}
       
function obterAgenteAleatorio(){
    const agentesDisp = agentes.filter(agente => !agentesUsados.some(usado => usado.uuid === agente.uuid))
    if (agentesDisp.length === 0) {
        return null
    }
    const agenteAleatorio = Math.floor(Math.random()* agentesDisp.length)
    return agentesDisp[agenteAleatorio]
}

function mostrarProxAgente() {
    feedback.textContent = ''
    resposta.value = ''
    resposta.disabled = false
    verificar.disabled = false
    
    const agente = obterAgenteAleatorio()
    if (!agente) {
        return
    }
    agenteAtual = agente
    agentesUsados.push(agente)
    imagemAgente.src = agente.icone
    setTimeout(()=>{
        resposta.focus()
    },300)
}

// cria a função para verificar a resposta
function verificarResposta(event) {
    event.preventDefault();
    if (!agenteAtual) {
        return
    }
    const respostaUsuario = resposta.value.trim()
    const respCorreta = respostaUsuario.toLowerCase() === agenteAtual.nome.toLowerCase()
    resposta.disabled = true
    verificar.disabled = true
    if (respCorreta) {
        feedback.textContent = `Correto, o agente era ${agenteAtual.nome}`
        feedback.style.color = "white"
        setTimeout(mostrarProxAgente, 3000)
    }
    else {
        feedback.textContent = `Errou, o agente era ${agenteAtual.nome}`
        feedback.style.color = "white"
        setTimeout(mostrarProxAgente, 3000)
    }
}