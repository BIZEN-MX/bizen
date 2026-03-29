import React from 'react';

export default function StructuredData() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'BIZEN',
    url: 'https://bizen.mx',
    logo: 'https://bizen.mx/icon.png',
    description: 'Plataforma líder en educación financiera para jóvenes y estudiantes en México.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'MX',
    },
    sameAs: [
      'https://www.linkedin.com/company/bizen-finanzas',
      'https://www.instagram.com/bizen.mx',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'BIZEN',
    url: 'https://bizen.mx',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://bizen.mx/glosario?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
