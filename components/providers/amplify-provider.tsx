"use client"

import { Amplify } from 'aws-amplify'
import awsConfig from '@/aws-exports'
import { ReactNode, useEffect } from 'react'

Amplify.configure(awsConfig)

export function AmplifyProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
} 