# CMVI — web migration

This branch preserves the 2017 Java source and adds a standalone, dependency-free browser port in `web/`.

## Local preview

```sh
python3 -m http.server 8080 --directory web
```

Open http://localhost:8080. No backend or secrets are needed.

## Cloudflare

Deploy from this branch with the root Wrangler configuration: `npx wrangler deploy`. Configure a development domain before adding a production route. No custom domain is configured here.

For Git-connected Workers Builds, select `web` as the production branch in the Worker's build settings (this is the development Worker for now). Use repository root `/`, leave the build command empty, and set the deploy command to `npx wrangler deploy`. The legacy `master` branch does not contain the web assets or Wrangler configuration.

## Scope

Implemented: Gaussian elimination, Jacobi, Gauss–Seidel, determinant, inverse matrix, Newton, fixed-point iteration, Lagrange interpolation, trapezoidal and Simpson integration, and finite-difference sweep for linear second-order boundary-value problems. Krylov uses an orthonormal restarted Krylov (Arnoldi) basis, Hessenberg characteristic polynomial recurrence, shifted complex QR eigenvalues and verified eigenvectors for matrices up to 10 × 10. Repeated and close eigenvalues can be ill-conditioned; multiplicities are numerical estimates. The web methods use independent JavaScript implementations of the same mathematical algorithms, not a line-by-line Java translation. Newton uses a numerical derivative and an initial guess; fixed-point iteration takes an explicit g(x). Sweep uses first-order Robin boundary discretization. Legacy file import, localization, and parity with the original Java examples remain to be completed. JSON result export, on-page solution reports, self-contained HTML report export and browser print/PDF are available. Reports include row operations, iteration histories, quadrature nodes, Lagrange terms and expanded coefficients, sweep tables and Krylov basis, characteristic polynomial, eigenvalues and verified eigenvectors. Large problems can produce long reports. Expressions use an explicit parser, not eval.

## Validation

The numerical engine was smoke-tested on known examples for all implemented method categories. Browser UI, edge cases, and original Java parity still need testing.

Run the Krylov numerical regression suite: `node --test tests/krylov.test.cjs`.
