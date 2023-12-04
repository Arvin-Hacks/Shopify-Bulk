import {
  Button, Card, DataTable, Frame, Badge, Page, Toast, Spinner, Modal, Text, Pagination, TextField, IndexTable, useIndexResourceState, ChoiceList, Select
} from "@shopify/polaris";
import { json } from '@remix-run/node'
import { useActionData, useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
import React, { useEffect, useState } from 'react'
// const { Product } = require('../db.server')
import Appcss from '../../app.css'
import { GetProducts, AddProduct, DeleteProduct, FilterProduct, searchAndSort } from '../api/DBquery.server'

export const links = () => {
  [{ rel: "stylesheet", href: Appcss }]
}

export const loader = async ({ request }) => {

  if (request.method === "GET") {
    let result = await GetProducts()
    result = await result.json()
    // console.log('jh', result)
    return json(result)
  } else {
    return null
  }
}

export const action = async ({ request }) => {

  const bodydata = await request.formData()
  let id = bodydata.get('id')

  switch (request.method) {
    case "PUT":
      // Add Static product data
      try {
        let res = await AddProduct()
        return json({ data: res, status: true })
      } catch (error) {
        return json({ error: "Something went Wrong", status: false })
      }
      break;
    case "DELETE":
      // Delete Product from database
      console.log('Delete id', id)
      try {
        let result = await DeleteProduct(id)
        result = await result.json()
        return json({ data: result, status: true })
      } catch (error) {
        return json({ error: "Something went Wrong", status: false })
      }
    case "POST":
      // filter Product Data
      try {
        let filter = bodydata.get('filter')
        let key = bodydata.get('key')
        let result = await FilterProduct(filter, key)
        result = await result.json()
        return json({ data: result, status: true, flage: true })
      } catch (error) {
        return json({ error: "Something went Wrong", status: false })
      }
    default:
      return json({ error: "Something went Wrong", status: false })
  }
}

export default function () {
  const submit = useSubmit()
  const Navigate = useNavigate()
  const action_data = useActionData()
  const loaderData = useLoaderData()
  const [products, setProducts] = useState(loaderData)



  const [active, seActive] = useState(false)
  const [msg, setMsg] = useState(false)
  const [errmsg, seterrMsg] = useState(false)
  const [loader, setLoader] = useState(false)
  const [deleteid, setDeleteid] = useState('')
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState('')

  // console.log('loadxer', loaderData)

  const startIndex = (currentPage - 1) * 5;
  const endIndex = startIndex + 5;
  const paginatedData = products.slice(startIndex, endIndex);


  // Handle Pagination Change 
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

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
        setProducts(action_data?.data?.data)
      }

    }

  }, [action_data,])


  const resourceName = {
    singular: 'Product',
    plural: 'Products',
  };

  // handle search operation 
  const handlesearch = (filtertype, key) => {
    if (key !== '') {
      submit({ key: key, filter: filtertype }, { method: 'POST' })
    }
    else {
      console.log('empty', loaderData)
      setProducts(loaderData)
    }
  }

  const select_option = [
    { label: 'Sort by ', disabled: true, key: '1' },
    { label: 'Newest Products', value: '-1', key: '2' },
    { label: 'Oldest Products', value: '1', key: '3' },
  ]

  return (
    <div>
      <Page title="Products">
        <Frame>
          {/* <Button pressed onClick={() => { submit({ id: '12' }, { method: "PUT" }) }}>{loader ? <Spinner size="small" /> : "+ Add"} </Button> */}
          <div style={{ display: "flex" }}>
            <div style={{ border: '1px solid gray', padding: "0px", borderRadius: '8px', margin: "10px" }}>
              <input
                className="Polaris-TextField__Input"
                // label="Search"
                placeholder="Search..."
                type="text"
                autoComplete="off"
                onChange={(value) => handlesearch('Search', value.target.value)}
              />

            </div>
            <div style={{ width: "200px", margin: "10px" }}>
              <Select
                options={select_option}
                // labelInline
                // label="Sort by"
                value={selected}
                onChange={(value) => { setSelected(value), handlesearch('Sort', value) }}
              />
            </div>
          </div>

          <Card>
            <Pagination
              hasNext={currentPage * 5 < products.length}
              hasPrevious={currentPage > 1}
              onPrevious={() => handlePageChange(currentPage - 1)}
              onNext={() => handlePageChange(currentPage + 1)}
              type="table"
              label={`Page ${currentPage} of ${Math.ceil(products.length / 5)} `}
            // label={`product ${currentPage*5} of ${products.length} `}
            />
            <IndexTable
              resourceName={resourceName}
              itemCount={products.length}
              selectable={false}
              headings={[
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
                    position={index}
                  >
                    <IndexTable.Cell>
                      <Text variant="bodyMd" fontWeight="bold" as="span">
                        {title}
                      </Text>
                    </IndexTable.Cell>
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

              }
            </IndexTable>
          </Card>

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