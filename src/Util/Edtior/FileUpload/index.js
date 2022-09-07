import axios from 'axios'
import { fileUploadApiRequest } from '../../util'
class MyUploadAdapter {
  constructor(loader, document) {
    // The file loader instance to use during the upload.
    this.loader = loader
    this.document = document
  }

  // Starts the upload process.
  upload() {
    const document = this.document
    const loader = this.loader
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          const formatFileName = () => {
            const element = document.querySelector('.active-test-row')

            if (!element) return file.name

            const type = element.getAttribute('data-type')
            const typeId = element.getAttribute('data-typeId')
            return `${type}-${typeId}-${Date.now()}.${file.type.split('/')[1]}`
          }
          return fileUploadApiRequest('getSignedUrl', 'POST', {
            fileName: formatFileName(),
            contentType: file.type,
          })
            .then(({ signedUrl: url }) => {
              const options = {
                headers: {
                  'Content-Type': file.type,
                },
                onUploadProgress: function (progressEvent) {
                  loader.uploadTotal = progressEvent.total
                  loader.uploaded = progressEvent.loaded
                },
              }
              return axios
                .put(url, file, options)
                .then((response) => {
                  return resolve({
                    default: response.config.url.split('?')[0],
                  })
                })
                .catch((error) => {
                  console.log('uploading to S3: ' + error)
                  reject('Could not upload. Please try again later.')
                })
            })
            .catch((error) => {
              console.log('getting pre-signed URL: ' + error)
              reject('Could not upload. Please try again later.')
            })
        })
    )
  }
}

export default function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    // Configure the URL to the upload script in your back-end here!
    //console.log(JSON.stringify(editor, null, '\t'))
    return new MyUploadAdapter(loader, window.document)
  }
}
