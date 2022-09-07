import { Card, Result, Button } from 'antd';
import { Link } from 'react-router-dom'
import { ReactComponent as Create } from '../../../assets/create-green.svg'
import Icon from '@ant-design/icons'

export const InfoCard = ({ projectId, subTitle, title }) => {
    return <Card
        style={{
            height: 'calc(100vh - 34em)',
        }}
        title="Test Cases"
        bodyStyle={{ padding: 0 }}
    >
        <Result
            icon={
                <Icon
                    style={{
                        fontSize: '200px',
                        marginTop: -60,
                        marginBottom: -80,
                    }}
                    component={Create}
                />
            }
            title={
                <div style={{ fontSize: 15, marginTop: -30 }}>
                    {title}
                </div>
            }
            subTitle={subTitle}
            extra={
                <Link to={`/${projectId}/test-suites`}>
                    <Button size="small" type="link">
                        Go to test suites
                    </Button>
                </Link>
            }
        />
    </Card>
}

