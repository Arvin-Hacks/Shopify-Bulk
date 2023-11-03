import { json } from '@remix-run/node'
import { Form, useActionData, useLoaderData, useNavigate, useNavigation, useSubmit } from '@remix-run/react'
import { Button, Card, Frame, Page, Text, TextField, Toast,Spinner } from '@shopify/polaris'
import React, { useEffect, useState } from 'react'
import { Product } from '~/db.server'
const token = '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'
const url = 'https://AlphaaaStore.myshopify.com/admin/api/2023-10/products.json'


export const loader = async ({ params }) => {
    console.log('params', params)
    if (params.id) {
        try {
            let result = await Product.find({ _id: params.id })
            console.log('result', result)
            return json({ data: result, status: true })
        } catch (error) {
            console.log('result', error)
            return json({ error: "Something went Wrong", status: false })
        }
    }

    // try {
    //     const header = { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' }
    //     let result = await fetch(`https://AlphaaaStore.myshopify.com/admin/api/2023-10/products/${params.id}.json`, { method: "get", headers: header })
    //     result = await result.json()
    //     // console.log('product data', result)
    //     return result
    // } catch (error) {
    //     console.log('product data error', error)
    //     return []

    // }
    return null
}

export const action = async ({ request }) => {
    const bodydata = await request.formData()
    const product = {};
    for (const [key, value] of bodydata) {
        product[key] = value;
    }
    console.log('product', product)
    try {
        let result = await Product.updateOne({ _id: product.id }, { $set: product })

        console.log('res', result)

        // console.log('ressult...', result)
        return json({ data: result, status: true })

    } catch (error) {
        console.log('update error', error)
        return json({ data: error, status: false })

    }
    console.log('from data', bodydata)
    return null
}

const UpdateProduct = () => {
    const Navigate = useNavigate()
    const submit = useSubmit()
    const loaderdata = useLoaderData()
    const action_response = useActionData()


    const [msg, setMsg] = useState(false)
    const [errmsg, seterrMsg] = useState(false)
    const [loader, setLoader] = useState(false)

    const product = loaderdata.data[0]
    console.log('prodcut', loaderdata)
    // console.warn('product details',loaderdata)
    console.log('detail...', product)

    const [productdata, setProductdat] = useState({
        id: product._id,
        title: product.title,
        vendor: product.vendor,
        product_type: product.product_type,
    })

    const updateproduct = () => {
        if (productdata.title !== '') {
            console.warn('formdata...', productdata)

            submit(productdata, { method: 'PUT' })
            setLoader(true)
            // setTimeout(() => Navigate('/app'), 5000)
        } else {
            alert('Please Provide required data')
        }

    }
    useEffect(() => {
        if (action_response) {
            setLoader(false)
            console.log('useffect response', action_response)
            action_response.status ?
                (setMsg(true), setTimeout(() => { Navigate('/app/product'), 3200 }))
                : seterrMsg(true)
            // Navigate('/app')
            // setTimeout(() => { console.warn('masg state', msg) }, 5000)
        }

    }, [action_response])

    return (

        <Page title='Update Product'>
            <div style={{ width: '700px' }}>
                <Frame>
                    <Card >
                        <Form method='post'>
                            <TextField
                                requiredIndicator
                                label='Title'
                                name='title'
                                value={productdata.title}
                                onChange={(value) => setProductdat({ ...productdata, title: value })}
                                autoComplete='on'

                            />
                            <TextField
                                label='Product_Type'
                                name='product_Type'
                                value={productdata.product_type}
                                onChange={(value) => setProductdat({ ...productdata, product_type: value })}
                                autoComplete='on'

                            />
                            <TextField
                                label='Vendor'
                                name='vendor'
                                value={productdata.vendor}
                                onChange={(value) => setProductdat({ ...productdata, vendor: value })}
                                autoComplete='on'
                            />
                            <br />
                            <Button primary onClick={updateproduct} >{loader? <Spinner size='small'/>:'Update Product'}</Button>
                        </Form>
                        {msg ? <Toast onDismiss={() => setMsg(false)} content={'Product Updateded...  '} duration={4000}></Toast> : null}
                        {errmsg ? <Toast onDismiss={() => seterrMsg(false)} content={'Somthing went wrong  '} duration={3000} error></Toast> : null}
                    </Card>
                </Frame>
            </div>
        </Page>
    )
}

export default UpdateProduct