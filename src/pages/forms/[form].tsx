import type { InferGetStaticPropsType } from 'next';
import ErrorPage from 'next/error';
import { useRouter } from 'next/router';
import CognitoForm from '@tylermenezes/cognitoforms-react';
import { findIndex, merge, set } from 'lodash';
import { Loading } from '../../components/loading';
import Page from '../../components/page';
import Splash from '../../components/splash';
import { EmbeddedForm } from '../../interfaces/form';
import { readConfig } from '../../lib/data';
import useScreenSize, { screenSizes } from '../../services/screen-size/use';
import style from '../../styles/pages/[form].css';

const parseFormData = async (forms: { [key: string]: EmbeddedForm }) => {
  const parse = (await import('hypertag')).default;
  return Object.keys(forms).map((form) => {
    const data = forms[form];
    const tags = parse(data.embedTag || '', 'script');
    if (!tags.length) {
      throw Error(
        `embedTag in the form '${form}' could not be parsed. Please ensure ` +
          'the tag is copied exactly from the form creation website. (got: ' +
          `'${data.embedTag}')`
      );
    }
    const tag = tags[0];
    if (data.type !== 'cognito') {
      throw Error(
        `Unrecognized form type '${data.type}' in the form '${form}'. ` +
          "Currently only 'cognito' is supported"
      );
    }
    ['src', 'data-key', 'data-form'].forEach((attr) => {
      if (!(attr in tag)) {
        throw Error(
          `embedTag in the form '${form}' is missing the required attribute ` +
            `'${attr}' (has '${Object.keys(tag)}')`
        );
      }
    });

    return {
      src: tag.src,
      key: tag['data-key'],
      dataForm: tag['data-form'],
      id: form,
      ...forms[form]
    };
  });
};

export const getStaticProps = async () => {
  const config = await readConfig();
  const forms = await parseFormData(config.forms || {});

  return {
    props: {
      config,
      forms
    }
  };
};

export const getStaticPaths = async () => {
  const config = await readConfig();
  return {
    paths: (Object.keys(config.forms || {}) || [])
      .filter((name) => {
        return !config.forms?.[name].hidden;
      })
      .map((name) => {
        return { params: { form: name } };
      }),
    fallback: false
  };
};

const GenericForm = ({
  config,
  forms
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  const { form: formId, ...params } = router.query as {
    form: string;
    [key: string]: string;
  };
  const {
    state: { screenSize }
  } = useScreenSize();

  const formIndex = findIndex(forms, (form) => formId === form.id);
  if (formIndex < 0) {
    return <ErrorPage statusCode={404} />;
  }
  const formData = forms[formIndex];

  if (!formData) {
    return <ErrorPage statusCode={404} />;
  }

  const smallScreen = screenSize < screenSizes['md'];

  const prefillMappings = formData.prefillMappings ?? {};
  const prefill = merge(
    {},
    ...Object.keys(params).map((param) => {
      // if (! (param in params)) {
      //   return {};
      // }
      if (!prefillMappings[param]) {
        return {};
      }
      return set({}, prefillMappings[param], params[param]);
    })
  );

  return (
    <Page
      config={config}
      title={`${formData.shortTitle} - Brainhack Western 2023`}
      description="Form for Western Brainhack"
      splash={!smallScreen}
    >
      <Splash>
        {/* <Image src={Logo}></Image> */}
        {smallScreen ? null : <div className="spacer"></div>}
        <div className="container-sm back-card">
          <h1>{formData.title}</h1>
          <div className="container console overlap-up" id="registration-form">
            <CognitoForm
              loading={
                <div className="spacer">
                  <Loading className={style.loading} prefix="Loading " />
                </div>
              }
              formId={formData.dataForm}
              accountId={formData.key}
              prefill={prefill}
            />
          </div>
        </div>
      </Splash>
    </Page>
  );
};

export default GenericForm;
