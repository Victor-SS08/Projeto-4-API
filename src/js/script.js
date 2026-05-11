//DECLARAÇÕES DOS ELEMENTOS HTML PARA O DOM
const videoelement = document.getElementById("video");
const botaoscan = document.getElementById("btn-texto");
const resultado = document.getElementById("saida");
const canvas = document.getElementById("canvas");

//MÉTODO LIGAR CÂMERA

async function configurarcamera(){
    try{
        //solicita permissao para acessar camera do user
        const midia = await navigator.mediaDevices.getUserMedia({
            //habilita a camera traseira do celular
            video:{facingMode:"enviroment"},
            audio:false
        })
        //atribui o fluxo da camera ao elemento de video para visualizar
        videoelement.srcObject = midia;

    }catch(erro){
        resultado.innerText="erro ao acessar a camera", erro
    }
}
//executa a função para habilitar a camera
configurarcamera();

//CAPTURAR E LER O TEXTO
botaoscan.onclick =async()=>{
    //DESATIVA O BOTAO PARA EVITAR MTO CLIQUE 
    botaoscan.disabled = true;
    resultado.innerText = "fazendo leitura, aguarde..."

    //captura a imagem (foto)
    const contexo = canvas.getContext("2d");

    //ajusta o tamanho do canvas, interno para ser igual o do video
    canvas.width = videoelement.videoWidth;
    canvas.height = videoelement.videoHeight;

    //desenha o frame atual do video dentro do canvas(tira a foto)
    contexto.drawImage(videoelement,0,0,canvas,canvas.height);

    //processando com a api Tesseract
    try{
        //funcao do tesseract
        const {data:{text}} = await Tesseract.recognize(
            canvas, //a img que acabou de capturar
            "por", //idioma:portugues
            {looger: m=>console.log(m)} //show on log
        )
        resultado.innerText = text.trim().length > 0 ? text:"não foi possivel identificar o texto"
    }catch(erro){
        //resultado caso apresente erro
        resultado.innerText="Erro no processamento", erro.message;
    }
    finally{
        //habilita o botao para uma nova leitura
        botaoscan.disabled=false;
    }
}