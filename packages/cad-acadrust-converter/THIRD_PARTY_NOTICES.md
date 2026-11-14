# Third-party notices

This package is MIT licensed (see the repository's `LICENSE`). The file
`acadrust-engine.wasm` it ships is compiled from `engine/` (MIT, this
repository) together with the Rust crates listed below.

## acadrust — MPL-2.0

`acadrust-engine.wasm` contains **acadrust 0.6.8** by Hakan AK, compiled
without modification from the crate published on crates.io. acadrust is
licensed under the Mozilla Public License 2.0; this wasm file is an
"Executable Form" of it under that license.

- Source code: <https://crates.io/crates/acadrust/0.6.8>
  (`https://static.crates.io/crates/acadrust/acadrust-0.6.8.crate`) and
  <https://github.com/hakanaktt/acadrust>
- License text: <https://www.mozilla.org/MPL/2.0/>
- The exact version is pinned in `engine/Cargo.lock`; `wasm/BUILD_INFO.json`
  records the compiler and the hash of the build inputs.

No acadrust source file is copied into this repository. If acadrust is ever
patched here, the modified files stay under MPL-2.0 and their source must be
published with the build.

### ACadSharp — MIT (part of acadrust)

acadrust's DWG reader and writer include code ported and adapted from
ACadSharp.

Copyright (c) 2021 Albert Domenech

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## encoding_rs — (Apache-2.0 OR MIT) AND BSD-3-Clause

encoding_rs is copyright Mozilla Foundation and used under the MIT license.
Its encoding tables derive from the WHATWG Encoding Standard:

Copyright © WHATWG (Apple, Google, Mozilla, Microsoft).

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

## Other crates in the wasm

All permissively licensed; none is GPL or LGPL. Listed with
`cargo tree --target wasm32-wasip1 -e normal` in `engine/`.

| Crate | License |
| --- | --- |
| adler2 2.0.1 | 0BSD OR MIT OR Apache-2.0 |
| anyhow 1.0.104 | MIT OR Apache-2.0 |
| bitflags 2.13.2 | MIT OR Apache-2.0 |
| byteorder 1.5.0 | Unlicense OR MIT |
| cfg-if 1.0.5 | MIT OR Apache-2.0 |
| crc32fast 1.5.5 | MIT OR Apache-2.0 |
| equivalent 1.0.3 | Apache-2.0 OR MIT |
| flate2 1.1.11 | MIT OR Apache-2.0 |
| foldhash 0.2.0 | Zlib |
| hashbrown 0.17.1 | MIT OR Apache-2.0 |
| indexmap 2.14.2 | Apache-2.0 OR MIT |
| itoa 1.0.19 | MIT OR Apache-2.0 |
| memchr 2.8.3 | Unlicense OR MIT |
| minimal-lexical 0.2.1 | MIT OR Apache-2.0 |
| miniz_oxide 0.9.1 | MIT OR Zlib OR Apache-2.0 |
| nom 7.1.3 | MIT |
| oem_cp 2.1.2 | MIT |
| once_cell 1.21.4 | MIT OR Apache-2.0 |
| phf 0.11.3, phf_shared 0.11.3 | MIT |
| ryu 1.0.23 | Apache-2.0 OR BSL-1.0 |
| scopeguard 1.2.0 | MIT OR Apache-2.0 |
| simd-adler32 0.3.10 | MIT |
| siphasher 1.0.4 | MIT OR Apache-2.0 |
| thiserror 2.0.21 | MIT OR Apache-2.0 |
| web-time 1.1.0 | MIT OR Apache-2.0 |
| Rust standard library | MIT OR Apache-2.0 |
