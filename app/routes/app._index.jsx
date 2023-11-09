import { useEffect, useState } from "react";
import { json } from "@remix-run/node";
import { Link, useActionData, useLoaderData, useNavigate, useNavigation, useSubmit } from "@remix-run/react";
import { Badge, Button, Card, Frame, IndexTable, Layout, LegacyCard, Page, Text, Pagination } from "@shopify/polaris";
import { BulkImportList } from '../api/DBquery.server'
import { CurrentBulkOperation } from '../api/api.server'

export function convertISODate(isoDate) {
  const date = new Date(isoDate);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

export const loader = async () => {
  try {

    let result = await CurrentBulkOperation()
    result = await result.json()
    console.log('ressss', result,)
    let bulklist = await BulkImportList()
    bulklist = await bulklist.json()
    console.log('tessssssss', bulklist,)
    return json({ data: result, Bulklist: bulklist, status: true })

  } catch (error) {
    // console.log('error', error)
    return json({ data: error, status: false })
  }
  return null
};


export default function Index() {
  const Navigate = useNavigate()
  const loader = useLoaderData()
  console.log('loader', loader)
  const bulkdata = loader?.Bulklist?.data

  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * 5;
  const endIndex = startIndex + 5;
  const paginatedData = bulkdata.slice(startIndex, endIndex);

  const resourceName = {
    singular: 'Bulk',
    plural: 'Bulks',
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <Page title="">
      <ui-title-bar title="Dashboard">

      </ui-title-bar>

      <Frame>
        <Layout>
          <Layout.Section>
            <LegacyCard title="Current Bulk Import " sectioned>
              <Text variant="headingMd" as="h6">Status: &nbsp;<Badge progress="">
                {loader.status ? loader?.data?.data?.data?.currentBulkOperation?.status : 'Unavailable'}
              </Badge> </Text>
              <br />
              <Button onClick={() => Navigate('/app/bulkUpload')} size="slim" primary>Bulk Import</Button>

            </LegacyCard>
          </Layout.Section>
          <Layout.Section variant="oneThird">
            <LegacyCard title="Bulk Operations" sectioned>
              <IndexTable
                resourceName={resourceName}
                itemCount={bulkdata.length}
                selectable={false}
                headings={[
                  { title: 'ID' },
                  { title: 'Status' },
                  { title: 'Type' },
                  { title: 'CreatedAt' },

                ]}
              >
                {paginatedData.map(
                  (
                    data,
                    index,
                  ) => (
                    <IndexTable.Row
                      id={data._id}
                      key={data._id}
                      position={index}
                    >
                      <IndexTable.Cell>
                        <Text variant="bodyMd" fontWeight="bold" as="span">
                          {data._id}
                        </Text>
                      </IndexTable.Cell>
                      <IndexTable.Cell><Badge >{data.status}</Badge></IndexTable.Cell>
                      <IndexTable.Cell>{data.type}</IndexTable.Cell>
                      <IndexTable.Cell>{convertISODate(data.createdAt)}</IndexTable.Cell>

                    </IndexTable.Row>
                  ),
                )}
              </IndexTable>

              <Pagination
                hasNext={currentPage * 5 < bulkdata.length}
                hasPrevious={currentPage > 1}
                onPrevious={() => handlePageChange(currentPage - 1)}
                onNext={() => handlePageChange(currentPage + 1)}
                type="table"
                label={`Page ${currentPage} of ${Math.ceil(bulkdata.length / 5)} `}
              // label={`product ${currentPage*5} of ${products.length} `}
              />


            </LegacyCard>
          </Layout.Section>
        </Layout>
        <Layout>
        </Layout>

      </Frame>

    </Page>
  );
}
