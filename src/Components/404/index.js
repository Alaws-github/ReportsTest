import StandaloneLayout from '../Layout/StandaloneLayout'
import PageContentContainer from '../Layout/PageContentContainer'
import NoPageMatch from '../Common/NoPageMatch'
import SEO from '../Common/SEO'

const NotFound = () => {
  return (
    <>
      <SEO title="404 - Not Found" />
      <StandaloneLayout>
        <PageContentContainer>
          <NoPageMatch />
        </PageContentContainer>
      </StandaloneLayout>
    </>
  )
}

export default NotFound
