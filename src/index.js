console.log('NEW_RELIC_LICENSE_KEY:', process.env.NEW_RELIC_LICENSE_KEY);
require('newrelic');

const express = require('express')
const app = express()


function isEmptyObject(obj) {
    for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
            return false;
        }
    }
 
    return true
}

//LISTADO DE PRODUCTOS

let productos = [ 

    {id: 851, title:"Heladera con freezer patrick 87458AB", category_id:"Electrodomesticos", price: 80, currency: "ARS", condition: "new", stock_available: 3, warranty:{apply: true, value_name: "5 meses"}, description:{ability: "275 l", cooling_type: "ciclica", height: "180cm"} },
    {id: 2, title:"Heladera no frost Electrolux DFN3500", category_id:"Electrodomesticos", price: 140, currency: "ARS", condition: "new", stock_available: 7, warranty:{apply: false, value_name: "null"}, description:{ability: "374 l", cooling_type: "ciclica", height: "180cm"} },
    {id: 3, title:"Heladera minibar Vondom RFG40B", category_id:"Electrodomesticos", price: 50, currency: "ARS", condition: "new", stock_available: 5, warranty:{apply: true, value_name: "5 meses"}, description:{ability: "275 l", cooling_type: "ciclica", height: "180cm"} },
    {id: 4, title:"Heladera no frost Philco PHSB530XT", category_id:"Electrodomesticos", price: 50, currency: "ARS", condition: "new", stock_available: 20, warranty:{apply: true, value_name: "5 meses"}, description:{ability: "275 l", cooling_type: "ciclica", height: "180cm"} },
    {id: 5, title:"Heladera inverter no frost Samsung RT38K5932", category_id:"Electrodomesticos", price: 400, currency: "ARS", condition: "new", stock_available: 36, warranty:{apply: true, value_name: "5 meses"}, description:{ability: "275 l", cooling_type: "ciclica", height: "180cm"} },
    {id: 6, title:"Heladera no frost Vondom SBS566 acero inoxidable con freezer", category_id:"Electrodomesticos", price: 100, currency: "ARS", condition: "new", stock_available: 45, warranty:{apply: true, value_name: "5 meses"}, description:{ability: "275 l", cooling_type: "ciclica", height: "180cm"} },
    {id: 7, title:"Heladera minibar Peabody HBM135", category_id:"Electrodomesticos", price: 89, currency: "ARS", condition: "new", stock_available: 100, warranty:{apply: false, value_name: "null"}, description:{ability: "275 l", cooling_type: "ciclica", height: "180cm"} },
    {id: 8, title:"Heladera inverter no frost Samsung RS27T5561", category_id:"Electrodomesticos", price: 75, currency: "ARS", condition: "new", stock_available: 1, warranty:{apply: false, value_name: "null"}, description:{ability: "275 l", cooling_type: "ciclica", height: "180cm"} },
    {id: 9, title:"Lavarropas automático Drean Next 8.14", category_id:"Electrodomesticos", price: 100, currency: "ARS", condition: "new", stock_available: 200, warranty:{apply: true, value_name: "5 meses"}, description:{ability: "15 kg", height: "100 cm"} },
    {id: 10, title:"Lavarropas automático Samsung WW90J5410G", category_id:"Electrodomesticos", price: 105, currency: "ARS", condition: "new", stock_available: 15, warranty:{apply: true, value_name: "5 meses"}, description:{ability: "8 kg", height: "75 cm"} },
    {id: 11, title:"Lavarropas automático Enova ATH-EWM", category_id:"Electrodomesticos", price: 500, currency: "ARS", condition: "new", stock_available: 72, warranty:{apply: true, value_name: "5 meses"}, description:{ability: "10 kg", height: "60 cm"} },
    {id: 12, title:"Lavarropas automático LG WM85WE6", category_id:"Electrodomesticos", price: 344, currency: "ARS", condition: "new", stock_available: 9, warranty:{apply: true, value_name: "5 meses"}, description:{ability: "10 kg", height: "80 cm"} },
]



//Declaro los middlewares

app.use(express.json()); // transforma body en json

app.use((req, res, next)=> {
    //console.log(req.method);
    next();
  });



//Endpoints middlewares

app.get('/api/v1/productos', (req, res) => {
    const newrelic = require('newrelic');

    try {
        if (!productos || !Array.isArray(productos)) {
            // Evento: Error al obtener lista
            newrelic.recordCustomEvent('ListaProductosFallida', {
                motivo: 'Array productos no válido',
                estado: 'Error'
            });

            return res.status(500).json({
                status: 'error',
                message: 'No se pudo obtener la lista de productos',
            });
        }

        // Evento: Lista obtenida correctamente
        newrelic.recordCustomEvent('ListaProductosConsultada', {
            cantidad: productos.length,
            estado: 'Exito'
        });

        return res.status(200).json({
            status: 'success',
            message: 'Lista de productos obtenida correctamente',
            data: productos
        });

    } catch (error) {
        newrelic.noticeError(error);

        return res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error inesperado al obtener los productos'
        });
    }
});


app.get('/api/v1/productos/:id', (req, res) => {
    const newrelic = require('newrelic');

    try {
        const productId = req.params.id;
        const prod = productos.find(producto => producto.id == productId);

        if (!prod) {
            // Evento: Producto no encontrado
            newrelic.recordCustomEvent('ProductoBusquedaFallida', {
                productoId: productId,
                estado: 'NoEncontrado'
            });

            return res.status(404).json({
                status: 'error',
                message: `Producto con ID ${productId} no encontrado`
            });
        }

        // Evento: Producto encontrado correctamente
        newrelic.recordCustomEvent('ProductoConsultado', {
            productoId: productId,
            nombre: prod.title || null,
            categoria: prod.category_id || null,
            estado: 'Encontrado'
        });

        return res.status(200).json({
            status: 'success',
            message: 'Producto encontrado',
            data: prod
        });

    } catch (error) {
        newrelic.noticeError(error);

        return res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error inesperado al buscar el producto'
        });
    }
});



app.post('/api/v1/productos', (req, res) => {
    const newrelic = require('newrelic');

    try {
        const {
            title,
            category_id,
            price,
            currency,
            condition,
            stock_available,
            warranty,
            description
        } = req.body;

        // Validación básica de campos obligatorios
        if (!title || !category_id || !price || !currency || !condition || stock_available == null) {
            newrelic.recordCustomEvent('ProductoCreacionFallida', {
                motivo: 'Campos obligatorios faltantes',
                ruta: '/api/v1/productos',
                estado: 'Error'
            });

            return res.status(400).json({
                status: 'error',
                message: 'Faltan campos obligatorios en el cuerpo de la solicitud'
            });
        }

        // Generar ID automáticamente
        const newId = productos.length ? Math.max(...productos.map(p => p.id)) + 1 : 1;

        const nuevoProducto = {
            id: newId,
            title,
            category_id,
            price,
            currency,
            condition,
            stock_available,
            warranty: warranty || { apply: false, value_name: null },
            description: description || {}
        };

        productos.push(nuevoProducto);

        // Evento personalizado: producto creado correctamente
        newrelic.recordCustomEvent('ProductoCreado', {
            productoId: newId,
            title,
            category_id,
            price,
            estado: 'Creado'
        });

        return res.status(201).json({
            status: 'success',
            message: 'Producto creado exitosamente',
            data: nuevoProducto
        });

    } catch (error) {
        newrelic.noticeError(error);

        return res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error al intentar crear el producto'
        });
    }
});



app.delete('/api/v1/productos/:id', (req, res) => {
    const newrelic = require('newrelic');

    try {
        const productId = req.params.id;
        const productoIndex = productos.findIndex(producto => producto.id == productId);

        if (productoIndex === -1) {
            // Evento: Producto no encontrado para eliminar
            newrelic.recordCustomEvent('EliminarProductoFallido', {
                productoId: productId,
                estado: 'NoEncontrado'
            });

            return res.status(404).json({
                status: 'error',
                message: `Producto con ID ${productId} no encontrado`
            });
        }

        const productoEliminado = productos[productoIndex];

        // Eliminar el producto del array
        productos.splice(productoIndex, 1);

        // Evento: Producto eliminado correctamente
        newrelic.recordCustomEvent('ProductoEliminado', {
            productoId: productId,
            nombre: productoEliminado.name || null,
            estado: 'Eliminado'
        });

        return res.status(200).json({
            status: 'success',
            message: 'Producto eliminado correctamente',
            data: productoEliminado
        });

    } catch (error) {
        newrelic.noticeError(error);

        return res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error inesperado al intentar eliminar el producto'
        });
    }
});



app.patch('/api/v1/productos/:id', (req, res) => {
    const newrelic = require('newrelic');
    
    try {
        const productId = req.params.id;
        const producto = productos.find(producto => producto.id == productId);

        if (!producto) {
            // Evento: Producto no encontrado
            newrelic.recordCustomEvent('ProductoNoEncontrado', {
                ruta: '/api/v1/productos/:id',
                productoId: productId,
                estado: 'NoEncontrado'
            });

            return res.status(404).json({
                status: 'error',
                message: `Producto con ID ${productId} no encontrado`
            });
        }

        const nuevoStock = req.body.stock_available;

        if (nuevoStock == null || typeof nuevoStock !== 'number') {
            // Evento: Stock inválido
            newrelic.recordCustomEvent('StockInvalido', {
                productoId: productId,
                stock: nuevoStock,
                estado: 'Invalido'
            });

            return res.status(400).json({
                status: 'error',
                message: 'El campo "stock_available" es obligatorio y debe ser un número'
            });
        }

        producto.stock_available = nuevoStock;

        // Evento: Actualización exitosa
        newrelic.recordCustomEvent('StockActualizado', {
            productoId: productId,
            nuevoStock,
            estado: 'Actualizado'
        });

        return res.status(200).json({
            status: 'success',
            message: 'Stock actualizado correctamente',
            data: producto
        });

    } catch (error) {
        newrelic.noticeError(error);

        return res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error al intentar actualizar el stock'
        });
    }
});



//Escucho puerto
app.listen(3000, () => {
    console.log("Running on port 3000...")
})

