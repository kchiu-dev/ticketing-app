# Step 1: Deploy

k8s_yaml(kustomize('overlays/development'))

# Step 2: Build

docker_build(
  'localhost:5000/auth',
  'auth',
  build_args={'authToken': os.getenv('CR_PAT'), 'BUILDKIT_INLINE_CACHE': '1'},
  cache_from='localhost:5000/auth',
  dockerfile='auth/Dockerfile.development',
  live_update=[
    sync('./auth', '/app'),
    run('cd /app && npm install', trigger=['auth/package.json'])
  ]
)

docker_build(
  'localhost:5000/client',
  'client',
  build_args={'BUILDKIT_INLINE_CACHE': '1'},
  cache_from='localhost:5000/client',
  dockerfile='client/Dockerfile.development',
  live_update=[
    sync('./client', '/app'),
    run('cd /app && npm install', trigger=['client/package.json'])
  ]
)

docker_build(
  'localhost:5000/tickets',
  'tickets',
  build_args={'authToken': os.getenv('CR_PAT'), 'BUILDKIT_INLINE_CACHE': '1'},
  cache_from='localhost:5000/tickets',
  dockerfile='tickets/Dockerfile.development',
  live_update=[
    sync('./tickets', '/app'),
    run('cd /app && npm install', trigger=['tickets/package.json'])
  ]
)

docker_build(
  'localhost:5000/orders',
  'orders',
  build_args={'authToken': os.getenv('CR_PAT'), 'BUILDKIT_INLINE_CACHE': '1'},
  cache_from='localhost:5000/orders',
  dockerfile='orders/Dockerfile.development',
  live_update=[
    sync('./orders', '/app'),
    run('cd /app && npm install', trigger=['orders/package.json'])
  ]
)

docker_build(
  'localhost:5000/expiration',
  'expiration',
  build_args={'authToken': os.getenv('CR_PAT'), 'BUILDKIT_INLINE_CACHE': '1'},
  cache_from='localhost:5000/expiration',
  dockerfile='expiration/Dockerfile.development',
  live_update=[
    sync('./expiration', '/app'),
    run('cd /app && npm install', trigger=['expiration/package.json'])
  ]
)

docker_build(
  'localhost:5000/payments',
  'payments',
  build_args={'authToken': os.getenv('CR_PAT'), 'BUILDKIT_INLINE_CACHE': '1'},
  cache_from='localhost:5000/payments',
  dockerfile='payments/Dockerfile.development',
  live_update=[
    sync('./payments', '/app'),
    run('cd /app && npm install', trigger=['payments/package.json'])
  ]
)

# Production Builds

# custom_build(
#   'localhost:5000/auth',
#   'docker buildx build --platform linux/amd64,linux/arm64 --file "auth/Dockerfile" --tag $EXPECTED_REF \
#   --secret id=cr_pat,src=auth/cr_pat.txt \
#   --cache-from type=registry,ref=localhost:5000/auth --cache-to type=inline --push auth',
#   ['./auth'],
#   skips_local_docker=True,
#   disable_push=True,
#   entrypoint='npm start',
#   live_update=[
#     sync('./auth', '/app'),
#     run('cd /app && npm install', trigger=['auth/package.json'])
#   ]
# )

# custom_build(
#   'localhost:5000/client',
#   'docker buildx build --platform linux/amd64,linux/arm64 --file "client/Dockerfile" --tag $EXPECTED_REF \
#   --cache-from type=registry,ref=localhost:5000/client --cache-to type=inline --push client',
#   ['./client'],
#   skips_local_docker=True,
#   disable_push=True,
#   entrypoint='npm run dev',
#   live_update=[
#     sync('./client', '/app'),
#     run('cd /app && npm install', trigger=['client/package.json'])
#   ]
# )

# custom_build(
#   'localhost:5000/tickets',
#   'docker buildx build --platform linux/amd64,linux/arm64 --file "tickets/Dockerfile" --tag $EXPECTED_REF \
#   --secret id=cr_pat,src=tickets/cr_pat.txt \
#   --cache-from type=registry,ref=localhost:5000/tickets --cache-to type=inline --push tickets',
#   ['./tickets'],
#   skips_local_docker=True,
#   disable_push=True,
#   entrypoint='npm start',
#   live_update=[
#     sync('./tickets', '/app'),
#     run('cd /app && npm install', trigger=['tickets/package.json'])
#   ]
# )

# custom_build(
#   'localhost:5000/orders',
#   'docker buildx build --platform linux/amd64,linux/arm64 --file "orders/Dockerfile" --tag $EXPECTED_REF \
#   --secret id=cr_pat,src=orders/cr_pat.txt \
#   --cache-from type=registry,ref=localhost:5000/orders --cache-to type=inline --push orders',
#   ['./orders'],
#   skips_local_docker=True,
#   disable_push=True,
#   entrypoint='npm start',
#   live_update=[
#     sync('./orders', '/app'),
#     run('cd /app && npm install', trigger=['orders/package.json'])
#   ]
# )

# custom_build(
#   'localhost:5000/expiration',
#   'docker buildx build --platform linux/amd64,linux/arm64 --file "expiration/Dockerfile" --tag $EXPECTED_REF \
#   --secret id=cr_pat,src=expiration/cr_pat.txt \
#   --cache-from type=registry,ref=localhost:5000/expiration --cache-to type=inline --push expiration',
#   ['./expiration'],
#   skips_local_docker=True,
#   disable_push=True,
#   entrypoint='npm start',
#   live_update=[
#     sync('./expiration', '/app'),
#     run('cd /app && npm install', trigger=['expiration/package.json'])
#   ]
# )

# custom_build(
#   'localhost:5000/payments',
#   'docker buildx build --platform linux/amd64,linux/arm64 --file "payments/Dockerfile" --tag $EXPECTED_REF \
#   --secret id=cr_pat,src=payments/cr_pat.txt \
#   --cache-from type=registry,ref=localhost:5000/payments --cache-to type=inline --push payments',
#   ['./payments'],
#   skips_local_docker=True,
#   disable_push=True,
#   entrypoint='npm start',
#   live_update=[
#     sync('./payments', '/app'),
#     run('cd /app && npm install', trigger=['payments/package.json'])
#   ]
# )

# Step 3: Watch

k8s_resource(
  workload='auth-depl',
  port_forwards=[
    port_forward(9000, 9000, 'debug auth-depl'),
  ]
)
k8s_resource(
  workload='client-depl',
  port_forwards=[
    port_forward(9001, 9001, 'debug client-depl'),
  ]
)
k8s_resource(
  workload='tickets-depl',
  port_forwards=[
    port_forward(9002, 9002, 'debug tickets-depl'),
  ]
)
k8s_resource(
  workload='orders-depl',
  port_forwards=[
    port_forward(9003, 9003, 'debug orders-depl'),
  ]
)
k8s_resource(
  workload='expiration-depl',
  port_forwards=[
    port_forward(9004, 9004, 'debug expiration-depl'),
  ]
)
k8s_resource(
  workload='payments-depl',
  port_forwards=[
    port_forward(9005, 9005, 'debug payments-depl'),
  ]
)