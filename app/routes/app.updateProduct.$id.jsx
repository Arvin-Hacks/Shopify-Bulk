import { json } from '@remix-run/node'
import { Form, useActionData, useLoaderData, useNavigate, useNavigation, useSubmit } from '@remix-run/react'
import { Button, Card, Frame, Page, Text, TextField, Toast,Spinner } from '@shopify/polaris'
import React, { useEffect, useState } from 'react'
import {GetProductDetails ,UpdateProductdata} from '../api/DBquery.server'



export const loader = async ({ params }) => {
    if (params.id) {
        try {
            let result = await GetProductDetails(params.id)
            return json({ data: result, status: true })
        } catch (error) {
            console.log('result', error)
            return json({ error: "Something went Wrong", status: false })
        }
    }
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
        let result = await UpdateProductdata(product.id,product)
        return json({ data: result, status: true })

    } catch (error) {
        console.log('update error', error)
        return json({ data: error, status: false })

    }
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

    const [productdata, setProductdat] = useState({
        id: product._id,
        title: product.title,
        vendor: product.vendor? product.vendor : '' ,
        product_type: product.product_type? product.product_type:'',
    })

    const updateproduct = () => {
        if (productdata.title !== '') {
            submit(productdata, { method: 'PUT' })
            setLoader(true)
        } else {
            alert('Please Provide required data')
        }
    }

    useEffect(() => {
        if (action_response) {
            setLoader(false)
            console.log('useffect response', action_response)
            action_response.status ?
                (setMsg(true), setTimeout(() => { Navigate('/app/product'), 4000 }))
                : seterrMsg(true)
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