const URL_PRODUCT = 'https://dummyjson.com/products';


export const getListProducts = async (skip: number) => {
    try {
        const res = await fetch(`${URL_PRODUCT}?limit=20&skip=` + (skip * 20))
        const data = await res.json();
        console.log("data get", data);
        return data.products;
    } catch (error) {
        console.log(error);
    }
}

export const searchProducts = async (search: string = '', skip: number = 0) => {
    try {
        const res = await fetch(`${URL_PRODUCT}/search?q=${search}&limit=20&skip=${skip * 20}`);
        const data = await res.json();
        console.log("data get search", data);
        return data.products;
    } catch (error) {
        console.log(error);
    }
}