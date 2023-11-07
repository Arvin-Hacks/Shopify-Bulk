import {
  Button, Card, DataTable, Frame, Badge, Page, Toast, Spinner, Modal, Text, Pagination, TextField, IndexTable, useIndexResourceState
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
    let result = await Product.find()
    return json(result)
  } else {
    return null
  }
}

export const action = async ({ request }) => {

  const bodydata = await request.formData()

  console.log('body data', bodydata)
  let id = bodydata.get('id')
  switch (request.method) {
    case "PUT":
      // Add Static product data
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
      // Delete Product from database
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
      // filter Product Data
      let filter = bodydata.get('filter')
      console.log('filter...', filter)
      switch (filter) {
        case "Search":
          let key = bodydata.get('key')
          try {
            let result = await Product.find({
              "$or":
                [
                  { title: { $regex: key, $options: "i" } },]
            }, [])
            console.log('result', result)
            return json({ data: result, status: true, flage: true })
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

      break;
    default:
      return null
      break;
  }
}

export const shouldRevalidate = () => {
  console.log('aaaaaaaaaa')
  return false
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
  const [currentPage, setCurrentPage] = useState(1);
  const [keyStatust, setKeyStatust] = useState('')
  const [products, setProducts] = useState(loaderData)
  // console.log('lpoasder',loaderData)

  // Covert Product data into row Formate (Polaris Datatable)
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
  const colums = ['Id', "Title", "vendor", "Type", "Actions"]



  // Handle Pagination Change 
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const startIndex = (currentPage - 1) * 5;
  const endIndex = startIndex + 5;
  const paginatedData = products.slice(startIndex, endIndex);


  console.warn('Action loaded', loaderData)

  // console.log('r',row)

  // Handle Product Delete Operation 
  const handleDelete = () => {
    submit({ id: deleteid }, { method: "DELETE" })
    setLoader(true)
  }

useEffect(() => {
    if (action_data) {
      setLoader(false); seActive(false);
      if (!action_data?.flage) {
        action_data.status ? (setMsg(true)) : seterrMsg(true)
        console.log('first', action_data)

      } else {
        console.warn('filterrrrrrrrrrrrr', action_data)
        setProducts(action_data?.data)
      }

    }

  }, [action_data])

  console.log('loader..', loaderData)

  const resourceName = {
    singular: 'Product',
    plural: 'Products',
  };

  // const { selectedResources, allResourcesSelected, handleSelectionChange } =useIndexResourceState(products)

  const handlesearch = (key) => {

    if (key !== '') {
      submit({ key: key, filter: 'Search' }, { method: 'POST' })
    }
    else {
      console.log('empty', loaderData)
      setProducts(loaderData)
    }
  }
  const sortt=['false','true','true','false','false']
  return (
    <div> 
      <Page title="Products">
        <Frame>
          <Button pressed onClick={() => { submit({ id: '12' }, { method: "PUT" }) }}>{loader ? <Spinner size="small" /> : "+ Add"} </Button>
          {/* < Button onClick={sortdata}>Test</Button> */}
          <div style={{ border: '1px solid gray', padding: "0px", borderRadius: '8px' }}>
            <input
              className="Polaris-TextField__Input"
              // label="Search"
              placeholder="Search..."
              type="text"
              autoComplete="off"
              onChange={(value) => handlesearch(value.target.value)}
            />

          </div>


          {/* <input type="text" placeholder="" onChange={() => submit({ id: '11' }, { method: "POST" })}></input> */}

          <Card>
            <Pagination
              hasNext={currentPage * 5 < products.length}
              hasPrevious={currentPage > 1}
              onPrevious={() => handlePageChange(currentPage - 1)}
              onNext={() => handlePageChange(currentPage + 1)}
              type="table"
              label={`Page ${currentPage} of ${Math.ceil(products.length / 5)} `}
            />
            <IndexTable
              resourceName={resourceName}
              itemCount={products.length}
              selectable={false}
              // sortable={sortt}

              //   selectedItemsCount={
              //     allResourcesSelected ? 'All' : selectedResources.length
              //   }
              //   onSelectionChange={handleSelectionChange}
              headings={[
                { title: 'ProductID' },
                { title: 'Title' },
                { title: 'Vendor' },
                { title: 'Type' },
                { title: 'Action', alignment: "center" },
              ]}
            >
              {paginatedData.map(
                (
                  { _id, title, vendor, product_type, productId },
                  index,
                ) => (
                  <IndexTable.Row
                    id={_id}
                    key={_id}
                    // selected={selectedResources.includes(id)}
                    position={index}
                  >
                    <IndexTable.Cell>
                      <Text variant="bodyMd" fontWeight="bold" as="span">
                        {productId}
                      </Text>
                    </IndexTable.Cell>
                    <IndexTable.Cell>{title}</IndexTable.Cell>
                    <IndexTable.Cell>{vendor}</IndexTable.Cell>
                    <IndexTable.Cell>{product_type}</IndexTable.Cell>
                    <IndexTable.Cell>
                      <div>
                        <Button pressed onClick={() => Navigate(`/app/updateProduct/${_id}`)}>Update</Button>&nbsp;
                        <Button destructive onClick={() => { seActive(true), setDeleteid(_id) }}>
                          Delete
                        </Button>
                      </div>
                    </IndexTable.Cell>
                  </IndexTable.Row>
                ),
              )
                // :
                // <IndexTable.Row>
                //   <IndexTable.Cell>
                //     No Product Found
                //   </IndexTable.Cell>
                // </IndexTable.Row>
              }
            </IndexTable>
          </Card>
          
          {/* <Card>
            <DataTable
              headings={colums.map((col) => col)}
              rows={paginatedData}
              columnContentTypes={['text', 'numeric', 'numeric', 'numeric', 'numeric',]}
            />
          </Card> */}

          {/* Toaster for success & error message */}
          {msg ? <Toast onDismiss={() => setMsg(false)} content={'Product Deleted... '} duration={4000}></Toast> : null}
          {errmsg ? <Toast onDismiss={() => seterrMsg(false)} content={'Somthing went wrong  '} duration={6000} error></Toast> : null}

          {/* Delete Confirmation Modal */}
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