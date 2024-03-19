import numpy as np
np.set_printoptions(floatmode="fixed", precision=30, suppress=True) # fixed point print

print('const binary16_values = [')
for i in range(0, 65535):
    binary16_bytes = i.to_bytes(2, 'little')
    binary16 = np.frombuffer(binary16_bytes, dtype=np.float16)
    binary16_str = str(binary16)[1:-1] # cannot set_printoptions a scalar, remove the brackets instead

    if binary16_str not in ['nan', 'inf', '-inf']:
        print(f'    [ "{binary16_str}", "{i:04x}" ],')
print('];')
print('export default binary16_values;')