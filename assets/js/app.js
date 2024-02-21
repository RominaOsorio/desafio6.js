const pesosInput = document.querySelector('#input');
const monedaSelect = document.querySelector('#selector');
const btn = document.querySelector('#boton');
const span = document.querySelector('#span');

const urlBase = 'https://mindicador.cl/api';
let myChart = null;


btn.addEventListener('click', async () => {
    const { value: pesos } = pesosInput;
    const { value: monedaSelected } = monedaSelect;
    
    const valorDeLaMoneda = await search(monedaSelected);
    
    const valorFinal = (pesos / valorDeLaMoneda).toFixed(2);
    span.innerHTML = `Resultado: $${valorFinal}`;
});

async function search(moneda) {
    try{
        const res = await fetch(`${urlBase}/${moneda}`);
        const data = await res.json();
        const { serie } = data;

        const datos = createDataToChart(serie.slice(0, 9).reverse());
        
        if (myChart) {
            myChart.destroy();
        }
        renderGrafica(datos);

        const [{ valor: valorDeLaMoneda}] = serie;
        return valorDeLaMoneda;

    }   catch (error) {
        alert('Ha ocurrido un error')
        console.log(error)
    }
}

function createDataToChart(serie) {
    const labels = serie.map(({fecha}) => FormatDate(fecha));
    const data = serie.map(({valor}) => valor);
    const datasets = [
        {
            label: 'Historial de los últimos 10 días',
            borderColor: 'rgb(255, 99, 132)',
            data,
        }
    ];
    return { labels , datasets };

}
function renderGrafica(data){
    const config = {
        type: 'line',
        data,
    }

 const canvas = document.getElementById('myChart').getContext('2d');

    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(canvas, config);
}
function FormatDate(date){
    date = new Date(date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
   return `${year} - ${month} - ${day}`;
 }