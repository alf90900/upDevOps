
const {describe, it} = require('node:test')
const assert = require('node:assert/strict')
const http = require('http')


const BASE_URL = 'http://localhost:3002'

describe("TEST: ", () =>{
    describe("GET Test: ", () =>{

        it("GET Products", (t, done) => {
            const options = {
                method: 'GET',
                hostname: 'localhost',
                port: 3002,
                path: '/api/v1/productos',
            }

            const req = http.request(options, (res) => {
                let data = ''

                res.on('data', chunk => {
                    data += chunk
                })

                res.on('end', () => {
                    try {
                        assert.equal(res.statusCode, 200)

                        const responseData = JSON.parse(data)
                        assert.equal(responseData.status, 'success')
                        assert.equal(responseData.message, 'Lista de productos obtenida correctamente')
                        assert.ok(Array.isArray(responseData.data))

                        done()
                    } catch (err) {
                        done(err)
                    }
                })
            })

            req.on('error', (err) => {
                done(err)
            })

            req.end()
        })
        
        it("GET product by ID", (t, done) => {
            const productId = 1 // Asegurate de que exista en tu array de productos
        
            const options = {
                method: 'GET',
                hostname: 'localhost',
                port: 3002,
                path: `/api/v1/productos/${productId}`
            }
        
            const req = http.request(options, (res) => {
                let data = ''
        
                res.on('data', chunk => {
                    data += chunk
                });
        
                res.on('end', () => {
                    try {
                        assert.equal(res.statusCode, 200)
        
                        const responseData = JSON.parse(data)
                        assert.equal(responseData.status, 'success')
                        assert.equal(responseData.message, 'Producto encontrado')
                        assert.ok(responseData.data)
                        assert.equal(responseData.data.id, productId)
        
                        done()
                    } catch (err) {
                        done(err)
                    }
                })
            })
        
            req.on('error', (err) => {
                done(err)
            });
        
            req.end()
        });

        it("GET product by ID - Not Found", (t, done) => {
            const productId = 9999
        
            const options = {
                method: 'GET',
                hostname: 'localhost',
                port: 3002,
                path: `/api/v1/productos/${productId}`
            }
        
            const req = http.request(options, (res) => {
                let data = ''
        
                res.on('data', chunk => {
                    data += chunk
                })
        
                res.on('end', () => {
                    try {
                        assert.equal(res.statusCode, 404)
        
                        const responseData = JSON.parse(data)
                        assert.equal(responseData.status, 'error')
                        assert.equal(responseData.message, `Producto con ID ${productId} no encontrado`)
        
                        done();
                    } catch (err) {
                        done(err)
                    }
                })
            })
        
            req.on('error', (err) => {
                done(err);
            });
        
            req.end();
        })

    })// fin del GET Test


    describe("POST Test: ", () =>{

        it("CREATE Product", async () => {
            const nuevoProducto = {
                title: "Producto Test",
                category_id: 10,
                price: 199.99,
                currency: "ARS",
                condition: "new",
                stock_available: 50,
                warranty: { apply: true, value_name: "6 meses" },
                description: { text: "Este es un producto de prueba" }
            }

            const res = await fetch(`${BASE_URL}/api/v1/productos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevoProducto)
            })

            assert.equal(res.status, 201)

            const responseData = await res.json()
            assert.equal(responseData.status, 'success')
            assert.equal(responseData.message, 'Producto creado exitosamente')
            assert.ok(responseData.data)
            assert.equal(responseData.data.title, nuevoProducto.title)
            assert.equal(responseData.data.category_id, nuevoProducto.category_id)
            assert.equal(responseData.data.price, nuevoProducto.price)
            assert.equal(responseData.data.currency, nuevoProducto.currency)
            assert.equal(responseData.data.condition, nuevoProducto.condition)
            assert.equal(responseData.data.stock_available, nuevoProducto.stock_available)
            assert.deepEqual(responseData.data.warranty, nuevoProducto.warranty)
            assert.deepEqual(responseData.data.description, nuevoProducto.description)
        })


        it("CREATE Product - Error por campos faltantes", async () => {
            const productoIncompleto = {
                // Falta title, category_id, price, currency, condition, stock_available
                description: { text: "Solo descripción sin datos obligatorios" }
            };

            const res = await fetch(`${BASE_URL}/api/v1/productos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productoIncompleto)
            });

            assert.equal(res.status, 400);

            const responseData = await res.json();
            assert.equal(responseData.status, 'error')
            assert.equal(responseData.message, 'Faltan campos obligatorios en el cuerpo de la solicitud')
        })
    
    })// fin del POST Test

    describe("PATCH: ", () =>{

        it("MODIFY Product", async () => {
            // Primero creamos un producto
            const nuevoProducto = {
                title: "Producto Test",
                category_id: 123,
                price: 100,
                currency: "ARS",
                condition: "new",
                stock_available: 10,
                warranty: { apply: true, value_name: "6 meses" },
                description: { text: "Descripción de prueba" }
            };

            const crearRes = await fetch(`${BASE_URL}/api/v1/productos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevoProducto)
            });

            const crearData = await crearRes.json()
            const idProductoCreado = crearData.data.id

            const nuevoStock = 25

            const res = await fetch(`${BASE_URL}/api/v1/productos/${idProductoCreado}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ stock_available: nuevoStock })
            });

            assert.equal(res.status, 200)

            const responseData = await res.json()

            assert.equal(responseData.status, 'success')
            assert.equal(responseData.message, 'Stock actualizado correctamente')
            assert.equal(responseData.data.stock_available, nuevoStock)
        })

        it("MODIFY Product - Error por producto no encontrado", async () => {
            const res = await fetch(`${BASE_URL}/api/v1/productos/99999`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ stock_available: 20 })
            })

            assert.equal(res.status, 404)

            const responseData = await res.json()

            assert.equal(responseData.status, 'error')
            assert.equal(responseData.message, 'Producto con ID 99999 no encontrado')
        })
        
    })// fin del PATCH Test


    describe("DELETE: ", () =>{

        it("DELETE Product by ID", async () => {
            // Primero creamos un producto
            const nuevoProducto = {
                title: "Producto para eliminar",
                category_id: 999,
                price: 300,
                currency: "ARS",
                condition: "new",
                stock_available: 10
            }

            const crearRes = await fetch(`${BASE_URL}/api/v1/productos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevoProducto)
            })

            const crearData = await crearRes.json()
            const idProducto = crearData.data.id

            //elimino el producto
            const eliminarRes = await fetch(`${BASE_URL}/api/v1/productos/${idProducto}`, {
                method: 'DELETE'
            });

            assert.equal(eliminarRes.status, 200)

            const responseData = await eliminarRes.json()

            assert.equal(responseData.status, 'success')
            assert.equal(responseData.message, 'Producto eliminado correctamente')
            assert.equal(responseData.data.id, idProducto)
        })

        it("DELETE Product by ID - Not Found", async () => {
            const idInexistente = 999999; // un ID que no exista

            const res = await fetch(`${BASE_URL}/api/v1/productos/${idInexistente}`, {
                method: 'DELETE'
            })

            assert.equal(res.status, 404)

            const responseData = await res.json()

            assert.equal(responseData.status, 'error')
            assert.equal(responseData.message, `Producto con ID ${idInexistente} no encontrado`)
        })


    })// fin del DELETE Test
    
})// fin todos los TEST









