$(document).ready(function()
{
    $('#response').addClass('d-none');
    $('#lista').addClass('d-none');

    $('#btnBuscar').on('click', function(e)
    {
        e.preventDefault();

        let hero = $('#txtBuscar').val();
        let url = seleccion(hero);
        ajax(url);
        $('#lista').addClass('d-none');
        
    });
});

datos = (data) =>
{ 
    let id;
    let nombre;
    let imagen;
    let trabajo;
    let altura;
    let peso;
    let alias;
    let alineacion;
    let comic;
    let combate;
    let durabilidad;
    let inteligencia;
    let fuerza;
    let velocidad;
    let fortaleza;
    let arrData = [];
    let listaSHV = "";

    if(data.response == "success")
    {
        if(data.results)
        {
            for(let i = 0; i < data.results.length; i++)
            {
                /*--Informacion General--*/
                id = data.results[i].id;
                nombre = data.results[i].name;
                listaSHV += `
                    <div class="col-12 col-md-6 col-xl-4">
                        <div class="alert alert-info text-center" role="alert">
                            <h4>${nombre}</h4> 
                            <button id="btnId" type="button" onClick="fntIdSelect(${id})" class="btn btn-warning">
                                <i class="fa-solid fa-magnifying-glass"></i>
                            </button>
                        </div>
                    </div>
                `;
            }
                arrData = [nombre, id];

                $('#lista').removeClass('d-none');
                $('#alert').html(listaSHV);
        }
        else
        {
            imagen = data.image.url;
            nombre = data.name;
            trabajo = data.work.occupation;
            altura = data.appearance.height[1];
            peso = data.appearance.weight[1];
            comic = data.biography.publisher;
            genero = data.appearance.gender;
            if(genero == 'Male')
            {
                genero = 'Masculino';
            }
            else
            {
                genero = 'Femenino';
            }
            alias = data.biography.aliases[0];
            alineacion = data.biography.alignment;

            if(alineacion == 'good')
            {
                alineacion = 'Superheroe';
            }
            else
            {
                alineacion = 'Villano';
            }

            /*-estadísticas de potencia-*/
            combate = data.powerstats.combat;
            durabilidad = data.powerstats.durability;
            inteligencia = data.powerstats.intelligence;
            fuerza = data.powerstats.power;
            velocidad = data.powerstats.speed;
            fortaleza = data.powerstats.strength;

            $('#encontrado').text(`${alineacion} Encontrado`);
            let card = `
                <img src="${imagen}" class="card-img-top" alt="">
                <div class="card-body">
                    <h3 class="text-center card-text">${nombre}</h3>
                    <p class="fs-4">Genero: ${genero}</p>
                    <p class="fs-4">Altura: ${altura}</p>
                    <p class="fs-4">Peso: ${peso}</p>
                    <p class="fs-4">Alias: ${alias}</p>
                    <p class="fs-4">Trabajo: ${trabajo}</p>
                    <p class="fs-4">alineación: ${alineacion}</p>
                    <p class="fs-4">Comic: ${comic}</p>
                </div>
            `;

            $('#response').removeClass('d-none');
            $('.card').html(card);

            arrData = [combate,durabilidad,inteligencia,fuerza,velocidad,fortaleza,nombre];
        } 
        return arrData;
    }
    else
    {
        Swal.fire("Error", "Superheroe o Villano no encontrado.", "error");
    }
}

ajax = (url) =>
{
    $.ajax({
        url : ""+url+"",
        type : "GET",
        dataType : "json",
        success : function(element)
        {
            let arrResponse = datos(element);

            let combate = arrResponse[0];
            let durabilidad = arrResponse[1];
            let inteligencia = arrResponse[2];
            let fuerza = arrResponse[3];
            let velocidad = arrResponse[4];
            let fortaleza = arrResponse[5];
            let nombre = arrResponse[6];

            /*--Grafico--*/
            if(combate === "null" || durabilidad === "null" || inteligencia === "null" || fuerza === "null" || velocidad === "null" || fortaleza === "null")
            {
                let parrafo = `
                    <p class="fs-2">No Hay Datos Para Mostrar.</p>
                `;

                $('#grafico').html(parrafo);
            }
            else
            {
                let chart = new CanvasJS.Chart("grafico", {
                    theme: "light2", // "light1", "light2", "dark1", "dark2"
                    exportEnabled: false,
                    animationEnabled: true,
                    title: {
                        text: "Estadisticas de Poder "+nombre+""
                    },
                    data: [{
                        type: "pie",
                        startAngle: 25,
                        toolTipContent: "<b>{label}</b>: {y}%",
                        showInLegend: "true",
                        legendText: "{label}",
                        indexLabelFontSize: 16,
                        indexLabel: "{label} - {y}%",
                        dataPoints: [
                            { y: combate, label: "Combate" },
                            { y: durabilidad, label: "Durabilidad" },
                            { y: inteligencia, label: "Inteligencia" },
                            { y: fuerza, label: "Fuerza" },
                            { y: velocidad, label: "Velocidad" },
                            { y: fortaleza, label: "Fortaleza" }
                        ]
                    }]
                });
                chart.render();
            }
        }
    });
}

seleccion = (letnum) =>
{
    let urlFunction;
       
    if($.isNumeric(letnum))
    {
        heroId = letnum;
        urlFunction= `https://superheroapi.com/api.php/10230872184043731/${heroId}`;
        
    }
    else
    {
        heroName = letnum;
        urlFunction = `https://superheroapi.com/api.php/10230872184043731/search/${heroName}`;
        $('#response').addClass('d-none');
    }
    
    return urlFunction;
}

fntIdSelect = (id) =>
{
    let idSel = id;
    let url = seleccion(idSel);
    ajax(url);
}