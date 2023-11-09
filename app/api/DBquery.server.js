import { json } from '@remix-run/node'
import { Product, Bulkimport } from '../db.server'

export const GetProducts = async () => {
    try {
        let result = await Product.find()
        return json(result)
    } catch (error) {
        return json({ error: "Db Something went Wrong", status: false })
    }
}

export const BulkImportEntry = async () => {
    try {
        let bulkdata = new Bulkimport({ admin_graphql_api_id: 'bulkzxczc123', status: 'Completed', type: 'Mutation' })

        let result = await bulkdata.save()

        console.log('res', result)
        return json({ data: result, status: true })

    } catch (error) {
        console.log('result', error)
        return json({ error: "Something went Wrong", status: false })
    }
}

export const BulkImportList = async () => {
    try {
        // let bulkdata = new Bulkimport({ admin_graphql_api_id: 'bulkzxczc123', status: 'Completed', type: 'Mutation' })

        let result = await Bulkimport.find()

        console.log('Db res', result)
        return json({ data: result, status: true })

    } catch (error) {
        console.log('result', error)
        return json({ error: "Db Something went Wrong", status: false })
    }
}

export const AddProduct = async () => {
    try {
        const data = new Product({ title: 'App 1' })
        let res = await data.save()
        console.log('res', res)
        return json({ data: res, status: true })
    } catch (error) {
        console.log('result', error)
        return json({ error: "Something went Wrong", status: false })
    }
}

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

export const UpdateProductdata = async (id,product) => {
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