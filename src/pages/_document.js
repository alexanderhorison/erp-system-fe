// ** React Import
import { Children } from 'react'

// ** Next Import
import Document, { Html, Head, Main, NextScript } from 'next/document'

// ** Emotion Imports
import createEmotionServer from '@emotion/server/create-instance'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

class CustomDocument extends Document {
  render() {
    const env = process.env.NEXT_PUBLIC_ENVIRONTMENT || process.env.NEXT_PUBLIC_ENVIRONMENT || 'production'
    const faviconHref = env === 'development' ? '/favicon-dev.svg?v=2' : '/favicon.ico'
    const { title } = this.props

    return (
      <Html lang='en'>
        <Head>
          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link rel='preconnect' href='https://fonts.gstatic.com' />
          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap'
          />
          <link rel='apple-touch-icon' sizes='180x180' href='/images/apple-touch-icon.png' />
          <link rel='shortcut icon' href={faviconHref} />
          <link
            rel="stylesheet"
            type="text/css"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
          />

          {/*
            Intentionally no og:image / og:url: this app must not be indexed (see
            robots.txt + _app.js noindex meta) and we don't want link previews to
            show a large thumbnail card. Leaving only og:title lets platforms that
            support it (e.g. WhatsApp/iMessage) fall back to the page's own
            <link rel="icon"> as a small preview icon instead of a generic template
            image — not all platforms do this, but none will show a thumbnail card.
          */}
          <meta property='og:title' content={title} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
CustomDocument.getInitialProps = async ctx => {
  const originalRenderPage = ctx.renderPage
  const cache = createEmotionCache()
  const { extractCriticalToChunks } = createEmotionServer(cache)
  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: App => props =>
      (
        <App
          {...props} // @ts-ignore
          emotionCache={cache}
        />
      )
    })
  const initialProps = await Document.getInitialProps(ctx)
  const emotionStyles = extractCriticalToChunks(initialProps.html)

  const emotionStyleTags = emotionStyles.styles.map(style => {
    return (
      <style
        key={style.key}
        dangerouslySetInnerHTML={{ __html: style.css }}
        data-emotion={`${style.key} ${style.ids.join(' ')}`}
      />
    )
  })

  return {
    ...initialProps,
    styles: [...Children.toArray(initialProps.styles), ...emotionStyleTags],
    title: 'TJAHAYA BERKAT ABADI'
  }
}

export default CustomDocument
