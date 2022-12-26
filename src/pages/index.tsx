import Image from 'next/image'
import Link from 'next/link'

import { Meta } from '~/components/common/meta'
import { PageLayout } from '~/components/layout/page'

import logoImage from '../../public/images/logo_lima.png'

const HomePage = () => {
  return (
    <PageLayout>
      <Meta />
      <section>
        <div className="wrapper">
          <div className="logo">
            <Image
              alt="Lima Studio"
              priority
              quality={100}
              src={logoImage}
              width={250}
            />
          </div>
          <h1>WE ARE COOKING SOMETHING UP.</h1>
          <p>
            In the meantime, you can ping us at{' '}
            <Link href="mailto:hi@limastudio.xyz">hi@limastudio.xyz</Link> or
            through{' '}
            <Link
              href="https://www.instagram.com/limastudio.xyz/"
              target="_blank"
              rel="noopener"
            >
              Instagram
            </Link>
          </p>
        </div>
      </section>
    </PageLayout>
  )
}

export default HomePage
