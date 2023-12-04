import { json } from '@remix-run/node'
import { Product, Bulkimport } from '../db.server'



// get all products from local Database
export const GetProducts = async () => {
    try {
        let result = await Product.find().sort({ createdAt: -1 })
        console.log('ds', result)
        return json(result)
    } catch (error) {
        return json({ error: "Db Something went Wrong", status: false })
    }
}

//Add new bulk operation
export const BulkImportEntry = async (data) => {

    const { id, status, type } = data

    try {
        let bulkdata = new Bulkimport({ admin_graphql_api_id: id, status: status, type: type })

        let result = await bulkdata.save()

        // console.log('res', result)
        return json({ data: result, status: true })

    } catch (error) {
        console.log('result', error)
        return json({ error: "Something went Wrong", status: false })
    }
}

//update status of Bulk operation 
export const BulkImportUpdate = async (data) => {

    try {
        let result = await Bulkimport.updateOne({ admin_graphql_api_id: data.admin_graphql_api_id }, {
            $set: data
        })
        console.log('result', result)
        return json({ data: result, status: true })
    } catch (error) {
        console.log('result', error)
        return json({ error: "Db Something went Wrong", status: false })
    }
}

//Add all bulk operationn list
export const BulkImportList = async () => {
    try {
        // let bulkdata = new Bulkimport({ admin_graphql_api_id: 'bulkzxczc123', status: 'Completed', type: 'Mutation' })
        let result = await Bulkimport.find().sort({ createdAt: -1 })
        // console.log('Db res', result)
        return json({ data: result, status: true })

    } catch (error) {
        console.log('result', error)
        return json({ error: "Db Something went Wrong", status: false })
    }
}

// Add new product 
export const AddProduct = async (product) => {
    try {
        const data = new Product(product)
        let res = await data.save()
        // console.log('res', res)
        return json({ data: res, status: true })
    } catch (error) {
        console.log('result', error)
        return json({ error: "Something went Wrong", status: false })
    }
}

//delete a product from db
export const DeleteProduct = async (id) => {
    try {
        let result = await Product.deleteOne({ _id: id })
        console.log('result', result)
        return json({ data: result, status: true })
    } catch (error) {
        console.log('result', error)
        return json({ error: "Something went Wrong", status: false })
    }
}

// get product data based on filtering option(search ,sort )
export const FilterProduct = async (filter, key) => {
    switch (filter) {
        case "Search":
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
            console.log('data', key, filter)
            try {
                let result = await Product.find().sort({ createdAt: parseInt(key) })
                console.log('result', result)
                return json({ data: result, status: true, flage: true })

            } catch (error) {
                console.log('result', error)
                return json({ error: "Something went Wrong", status: false })
            }

            break;
        default:
            return json({ error: "Something went Wrong", status: false })
            break;
    }


}

// get a Single product details based on product id 
export const GetProductDetails = async (id) => {
    try {
        let result = await Product.find({ _id: id })
        console.log('result', result)
        return json({ data: result, status: true })
    } catch (error) {
        console.log('result', error)
        return json({ error: "Something went Wrong", status: false })
    }
}

//Update a product details in db
export const UpdateProductdata = async (id, product) => {
    try {
        let result = await Product.updateOne({ _id: id }, { $set: product })

        console.log('res', result)

        // console.log('ressult...', result)
        return json({ data: result, status: true })

    } catch (error) {
        console.log('update error', error)
        return json({ data: error, status: false })

    }
}

// Testing purpose
export const searchAndSort = async (query, array) => {
    const regex = new RegExp(query, 'i'); // 'i' for case-insensitive search

    const filteredData = array.filter(item => {
        // You can customize this condition based on your regex search criteria
        return regex.test(item.title) || regex.test(item.vendor) || regex.test(item.product_type);
    });

    // Sorting by updatedAt in descending order
    filteredData.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    return filteredData;
}