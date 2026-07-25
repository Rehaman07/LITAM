/**
 * Generated from OpenAPI schema at /api/schema/
 * Regenerate with: npm run generate:api-types
 */
export interface paths {
  "/api/updates/": {
    get: {
      responses: {
        200: {
          content: {
            "application/json": components["schemas"]["Update"][];
          };
        };
      };
    };
  };
  "/api/updates/content/": {
    get: {
      responses: {
        200: {
          content: {
            "application/json": Record<string, components["schemas"]["Update"][]>;
          };
        };
      };
    };
  };
  "/api/updates/student-placements/": {
    get: {
      parameters: {
        query?: {
          top?: number;
        };
      };
      responses: {
        200: {
          content: {
            "application/json": components["schemas"]["StudentPlacement"][];
          };
        };
      };
    };
  };
  "/api/updates/contact-inquiries/": {
    post: {
      requestBody: {
        content: {
          "application/json": components["schemas"]["ContactInquiryRequest"];
        };
      };
      responses: {
        201: {
          content: {
            "application/json": components["schemas"]["ContactInquiry"];
          };
        };
      };
    };
  };
}

export interface components {
  schemas: {
    Update: {
      id: number;
      section: string;
      title: string;
      message: string;
      image: string | null;
      created_at: string;
    };
    StudentPlacement: {
      id: number;
      student_name: string;
      company_name: string;
      package_lpa: string;
      photo: string | null;
      created_at: string;
    };
    ContactInquiryRequest: {
      name: string;
      email?: string;
      phone: string;
      course: string;
      message?: string;
    };
    ContactInquiry: {
      id: number;
      name: string;
      email?: string;
      phone: string;
      course: string;
      message?: string;
      created_at: string;
    };
  };
}

export type Update = components["schemas"]["Update"];
export type StudentPlacement = components["schemas"]["StudentPlacement"];
export type ContactInquiry = components["schemas"]["ContactInquiry"];
export type ContactInquiryRequest = components["schemas"]["ContactInquiryRequest"];
