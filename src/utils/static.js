const getStaticFile = (filename) => {
    // window.location.href = `${mainUrl}/resources/ots/resources/explain/${filename}`

    // if (process.env.NODE_ENV == 'production') {

    //     // const str = window.location.href
    //     // const list = str.split('index.html#')
    //     const goUrl = `${mainUrl}/static/${filename}`
    //     window.location.href = goUrl
    // } else {
    //     window.location.href = `/static/${filename}`
    // }
    window.location.href = `./static/${filename}`
}
export default getStaticFile