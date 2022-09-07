import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import Logo from '../../Common/Logo'
import RegistrationForm from './RegistrationForm'
import NewHere from './NewHere'
import Plan from './Plan'
import Footer from './Footer'
import CenterIcon from './CenterIcon'
import { DownArrowIcon } from '../../Common/CustomIcons'
import { useAuth } from '../../../Context/AuthContext'
import { plans } from '../../../constants'
import { useMedia } from '../../../Hooks'
import { Col, Row } from 'antd'
import SEO from '../../Common/SEO'
import './styles.css'

const Register = () => {
  let history = useHistory()
  const { currentUser } = useAuth()
  const location = useLocation()
  const [plan, setPlan] = useState('')
  const [planCode, setPlanCode] = useState('')
  const [priceId, setPiceId] = useState('')

  const showIcon = useMedia(['(min-width: 1028px)'], [true], false)

  const handlePlan = (license) => {
    if (license.status === 'pending' || license.status === 'successful') {
      setPlan(license.plan)
      license.plan === 'qw:enterprise'
        ? setPlanCode(`${license.plan}:${license.numberOfUsers}`)
        : setPlanCode(license.plan)
      setPiceId(license?.priceId || '')
    } else {
      localStorage.removeItem('qualiytwatcher:pp')
      setPlan('')
    }
  }

  const getPlan = () => {
    // check local storage for plan
    const query = new URLSearchParams(location.search)
    const licenseParams = query.get('license')
    history.push({ search: '' })

    if (licenseParams) {
      // set plan to local storage
      localStorage.setItem('qualiytwatcher:pp', licenseParams)
      try {
        const license = JSON.parse(
          Buffer.from(licenseParams, 'base64').toString()
        )
        handlePlan(license)
      } catch (error) {
        console.log({ error })
        history.push({ search: '' })
      }
    } else {
      //check if plan is set in local storage
      const savedPlan = localStorage.getItem('qualiytwatcher:pp')
      try {
        const license = JSON.parse(Buffer.from(savedPlan, 'base64').toString())
        handlePlan(license)
      } catch (error) {
        console.log({ error })
        localStorage.removeItem('qualiytwatcher:pp')
        setPlan('')
      }
    }
  }

  useEffect(() => {
    getPlan()
  }, [])

  useEffect(() => {
    if (currentUser) {
      history.push('/')
    }
  }, [currentUser])

  return (
    <div>
      {plan ? (
        <>
          <SEO title="Register" />
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              height: '100vh',
              overflow: 'hidden',
              position: 'relative',
            }}
            className="with-plan"
          >
            {showIcon && <CenterIcon className="next-center-icon" />}
            <Row
              style={{
                width: '100%',
                overflow: 'auto',
              }}
            >
              <Col className="left-panel-custom">
                <div
                  style={{
                    zIndex: 100,
                    width: '100%',
                    height: '100%',
                    justifyContent: 'space-between',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Logo />
                  <Plan
                    title={`${plans?.[plan]?.title} Plan`}
                    features={plans?.[plan]?.features?.split(',')}
                  />
                  <Row
                    style={{
                      width: '100%',
                      marginTop: '2rem',
                    }}
                    justify="center"
                  >
                    {!showIcon && (
                      <DownArrowIcon
                        style={{
                          zIndex: 10,
                          color: 'white',
                          fontSize: '6rem',
                        }}
                      />
                    )}
                  </Row>

                  <Footer />
                </div>
              </Col>
              <Col className="right-panel-custom">
                <div
                  style={{
                    width: '100%',
                  }}
                >
                  <RegistrationForm
                    priceId={priceId}
                    planCode={planCode}
                    clearPlan={() => {
                      localStorage.removeItem('qualiytwatcher:pp')
                      setPlan('')
                    }}
                  />
                </div>
              </Col>
            </Row>
          </div>
        </>
      ) : (
        <div className="without-plan">
          <SEO title="Register - No Plan Screen" />
          <div
            style={{
              zIndex: 100,
              width: '100%',
              height: '100%',
              justifyContent: 'space-between',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Logo />
            <NewHere />
            <Footer />
          </div>
        </div>
      )}
    </div>
  )
}

export default Register
