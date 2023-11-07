import {
  Button, Card, DataTable, Frame, Page, Toast, Spinner, Modal, Text, Pagination, TextField
} from "@shopify/polaris";
import { json } from '@remix-run/node'
import { useActionData, useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
import ReactPaginate from 'react-paginate'
import React, { useEffect, useState } from 'react'
const { Product } = require('../db.server')
import Appcss from '../../app.css'

export const links = () => {
  [{ rel: "stylesheet", href: Appcss }]
}

export const loader = async ({ request }) => {

  if (request.method === "GET") {
    let re = await Product.find()
    return json(re)

    console.log('dfkjvhjk', request.method)
    return json({ data: 'test', status: true })
  } else {

  }
  // let data = await fetch("http://localhost:5000/temp",{method:'post'})
  // data=await data.json()




}
export const action = async ({ request }) => {

  const bodydata = await request.formData()

  console.log('body data', bodydata)
  let id = bodydata.get('id')
  switch (request.method) {
    case "PUT":
      console.log('Post id', bodydata.get('id'))
      try {
        const data = new Product({ title: 'a1' })
        let res = await data.save()
        console.log('res', res)
        return json({ data: res, status: true })
      } catch (error) {
        console.log('result', error)
        return json({ error: "Something went Wrong", status: false })
      }
      break;
    case "DELETE":
      console.log('Delete id', id)
      try {
        let result = await Product.deleteOne({ _id: id })
        console.log('result', result)
        return json({ data: result, status: true })
      } catch (error) {
        console.log('result', error)
        return json({ error: "Something went Wrong", status: false })
      }
      break;
    case "POST":
      if (request.method === 'PUT') {
        let filter = filedata.get('filter')
        switch (filter) {
          case "Search":
            let key = bodydata.get('key')
            try {
              let result = await Product.find({
                "$or":
                  [
                    { title: { $regex: key, $options: "i" } },]
              })
              console.log('result', result)
              return json({ data: result, status: true })
            } catch (error) {
              console.log('result', error)
              return json({ error: "Something went Wrong", status: false })
            }
            break;
          case "Sort":


            break;

          default:
            break;
        }
      }
      break;
    default:
      break;
  }
}


export default function () {
  const action_data = useActionData()
  const loaderData = useLoaderData()
  const submit = useSubmit()
  const Navigate = useNavigate()

  const [active, seActive] = useState(false)
  const [msg, setMsg] = useState(false)
  const [errmsg, seterrMsg] = useState(false)
  const [loader, setLoader] = useState(false)
  const [deleteid, setDeleteid] = useState('')
  // console.log('lpoasder',loaderData)
  const row = loaderData.map((data) => [
    // const [row, setRow] = useState(loaderData.map((data) => [
    data.productId,
    data.title,
    data.vendor,
    data.product_type,
    <div>
      <Button pressed onClick={() => Navigate(`/app/updateProduct/${data._id}`)}>Update</Button>&nbsp;
      <Button destructive onClick={() => { seActive(true), setDeleteid(data._id) }}>
        Delete
      </Button>
    </div>

  ])


  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const startIndex = (currentPage - 1) * 5;
  const endIndex = startIndex + 5;
  const paginatedData = row.slice(startIndex, endIndex);


  console.warn('Action loaded', loaderData)

  // console.log('r',row)


  const handleDelete = () => {

    submit({ id: deleteid }, { method: "DELETE" })
    setLoader(true)
  }





  const colums = ['Id', "Title", "vendor", "Type", "Actions"]
  useEffect(() => {
    if (action_data) {
      setLoader(false); seActive(false);
      action_data.status ? (setMsg(true)) : seterrMsg(true)
      console.log('first', action_data)
    }

  }, [action_data, loaderData])


  return (
    <div>
      <Page title="Products">
        <Frame>
          {/* <Button pressed onClick={() => { submit({ id: '12' }, { method: "PUT" }) }}>{loader ? <Spinner size="small" /> : "+ Add"} </Button> */}
          {/* < Button onClick={sortdata}>Test</Button> */}

          {/* <input type="text" placeholder="Search..." onChange={() => submit({ id: '11' }, { method: "POST" })}></input> */}


          <Card>
            <DataTable
              headings={colums.map((col) => col)}
              rows={paginatedData}
              columnContentTypes={['text', 'numeric', 'numeric', 'numeric', 'numeric',]}
            />


            <Pagination
              hasNext={currentPage * 5 < row.length}
              hasPrevious={currentPage > 1}
              onPrevious={() => handlePageChange(currentPage - 1)}
              onNext={() => handlePageChange(currentPage + 1)}
              type="table"
              label={`Page ${currentPage} of ${Math.floor(row.length / 5)} `}
            />

          </Card>

          {msg ? <Toast onDismiss={() => setMsg(false)} content={'Product Deleted... '} duration={4000}></Toast> : null}
          {errmsg ? <Toast onDismiss={() => seterrMsg(false)} content={'Somthing went wrong  '} duration={6000} error></Toast> : null}


          <Modal
            open={active}
            onClose={() => seActive(false)}
            title="Delete Confirmation"
            primaryAction={{
              content: loader ? <Spinner size='small' /> : "Delete",
              onAction: handleDelete

            }}
            secondaryActions={[{
              content: "Cancel",
              onAction: () => seActive(false)
            }]}
          >
            <Modal.Section>
              <Card>
                <Text variant="bodyLg" as="p">
                  Are You Sure to Delete This Product...?
                </Text>
              </Card>
            </Modal.Section>

          </Modal>
        </Frame>
      </Page>


    </div>
  );
}