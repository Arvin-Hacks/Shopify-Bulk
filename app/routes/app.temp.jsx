import { json } from '@remix-run/node'
import { Form, useActionData, useSubmit } from '@remix-run/react'
import { Button, Card, Checkbox, Frame, Page, Toast } from '@shopify/polaris'
import React, { useEffect, useState, useCallback } from 'react'
import TableData from './../component/TableData'
import { authenticate } from '~/shopify.server'
// import LineChart from '~/component/LineChart'


export const action = async ({ request }) => {
    const { admin } = await authenticate.admin(request)

    // const bodydata = await request.formData()
    console.log("bodydata..", await request)
    const bodydata2 = await request.text()

    console.log("bodydata..", typeof (bodydata2))
    // const user = JSON.parse(bodydata)

    // console.log('user', user)

    // const customer = { firstName: 'Shiva', lastName: 'Paul', email: 'pauls31@info.com', phone: '9906543256', }
    // const result = await admin.graphql(
    //     `mutation customerCreate($input: CustomerInput!) {
    //          customerCreate(input: $input) {
    //              userErrors { 
    //                 field 
    //                 message
    //              } 
    //              customer {
    //                 email
    //                  phone 
    //                  firstName 
    //                  lastName  
    //             } 
    //         } 
    //     }`,
    //     { variables: { "input": customer } }
    // )

    // console.log('result', await result.json())

    return json({ data: 'result', status: true })
}


export const loader = async ({ request }) => {
    console.log('loader')
    return null

}

const Temp = () => {
    const Action_res = useActionData()
    const submit = useSubmit()
    const [msg, setMsg] = useState(false)
    const [errmsg, seterrMsg] = useState(false)

    useEffect(() => {
        if (Action_res) {
            console.log('action', Action_res)
            console.log('ac', Action_res.status)
        }
    }, [Action_res])

    const user = { name: 'jack', email: 'jack@info.com', phone: 87878886456, flag: true }

    const [checked, setChecked] = useState(false);
    const handleChange = useCallback(
        (newChecked) => setChecked(newChecked),
        [],
        console.warn('onchange event called')
    )

    const handleSubmit = () => {
        submit(user, { method: 'PUT' })
    }

    return (
        <Page title='Temprory'>
            <Frame>
                <Card>
                    <Checkbox
                        checked={checked}
                        onChange={handleChange}
                    />

                    <p>testing</p>
                    <Form method='post' >
                        <button type='submit'>Test</button>
                        <Button onClick={handleSubmit} >Send Data</Button>
                    </Form>
                    {/* <TableData /> */}
                    {/* <LineChart labels={labels} data={data} /> */}
                </Card>
                {msg ? <Toast onDismiss={() => setMsg(false)} content={'Customer Updateded...  '} duration={4000}></Toast> : null}
                {errmsg ? <Toast onDismiss={() => seterrMsg(false)} content={'Somthing went wrong  '} duration={3000} error></Toast> : null}
            </Frame>
        </Page>

    )
}

export default Temp