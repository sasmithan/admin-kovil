<template>
  <div>
    <div>
      <Renderer
        ref="renderer"
        :width="canvasWidth"
        :height="canvasHeight"
        antialias
        :orbitCtrl="!createStructureMode"
      >
        <Camera
          ref="camera"
          :position="{ x: 500, y: 800, z: 1300 }"
          :lookAt="{ x: 0, y: 0, z: 0 }"
          :fov="40"
          :aspect="canvasWidth / canvasHeight"
          :near="1"
          :far="10000"
        />
        <Scene ref="scene" background="#f1f5f9">
          <Mesh
            ref="plane"
            @pointerOver="onPointerOver"
            @pointerMove="onPointerMove"
            @click="createStructureMode ? onPointerClick : null"
          >
            <PlaneGeometry
              :width="1000"
              :height="1000"
              :rotateX="-Math.PI / 2"
            />
            <BasicMaterial />
            <Box ref="rollOver" :size="50" v-if="createStructureMode">
              <BasicMaterial
                color="#ff0000"
                :props="{ transparent: true, opacity: 0.5 }"
              />
            </Box>
            <Box
              ref="box"
              :size="50"
              v-for="(bin, i) in binObjects"
              :key="i"
              :position="bin.position"
              :props="{ binId: bin.id }"
              @pointerMove="(event) => onBinMove(event, bin)"
              @pointerLeave="(event) => onBinLeave(event, bin)"
              @click="!createStructureMode ? onBinClicked(bin) : null"
            >
              <LambertMaterial :color="bin.color ?? '#f7c802'">
                <Texture
                  :src="require('@/assets/images/square-outline-textured.png')"
                  uniform="myCustomTexture"
                />
              </LambertMaterial>
            </Box>
          </Mesh>
          <AmbientLight color="#606060" />
          <DirectionalLight
            color="#ffffff"
            :position="{ x: 1, y: 0.75, z: 0.5 }"
          />
        </Scene>
      </Renderer>
    </div>

    <div class="container" v-if="selectedBin.name">
      <div
        class="target sideView w-1/4 bg-white my-3 p-2 rounded-lg"
        ref="target"
      >
        <div class="">
          <div class="flex justify-between items-center py-2 sideHeadView">
            <h1 class="text-base font-semibold">
              Location: {{ selectedBin.name }}
            </h1>

            <a
              href="javascript:;"
              class="text-danger"
              @click="selectedBin.name = null"
            >
              <XIcon class="lg:w-6 lg:h-6 lg:-mt-1 w-4 h-4 mt-0" />
            </a>
          </div>

          <div
            class="bg-slate-100 rounded-md p-2 mt-2 flex-shrink-0"
            v-for="(box, i) in selectedBin.boxes"
            :key="i"
          >
            <div>Name: {{ box.name }}</div>
            <div>Max weight: {{ box.maxWeight || "nil" }}</div>
            <div>Max dimension: {{ box.maxDimension || "nil" }}</div>
            <div>Warehouse: {{ box.warehouseName || "nil" }}</div>
            <div>Section: {{ box.sectionName || "nil" }}</div>
            <div>Type: {{ box.storageTypeName || "nil" }}</div>

            <div
              class="bg-white rounded-md p-2 mt-2"
              v-for="(product, i) in box.products"
              :key="i"
            >
              <div>{{ "SKU: " + product.sku || "nil" }}</div>
              <div>{{ "EAN: " + product.skuDetail.ean || "nil" }}</div>
              <div>
                {{ "Desc: " + product.skuDetail.description || "nil" }}
              </div>
              <div>
                {{ "Price: " + currencyFormat(product.skuDetail.price) }}
              </div>
              <div>{{ "Qty: " + product.quantity || "nil" }}</div>
              <div>{{ "Expiry: " + momentLocal(product.expiryDate) }}</div>
            </div>
          </div>
        </div>
      </div>
      <Moveable
        className="moveable"
        v-bind:target="['.target']"
        v-bind:draggable="true"
        @drag="onDrag"
      />
    </div>
  </div>
</template>
<script>
import {
  Group,
  Raycaster,
  Texture,
  Mesh,
  PlaneGeometry,
  BasicMaterial,
  AmbientLight,
  DirectionalLight,
  Box,
  LambertMaterial,
  Camera,
  Renderer,
  Scene,
} from "troisjs";
import * as THREE from "three";
import axios from "../../../services/http-common";
import Moveable from "vue3-moveable";

import moment from "moment";
import {
  currencyFormat,
  percentageFormat,
  temperatureFormat,
  weightFormat,
  removeNullValue,
} from "../../../global-functions/functions";

export default {
  name: "Locations",
  components: {
    Moveable,
    Group,
    Raycaster,
    Texture,
    Mesh,
    PlaneGeometry,
    BasicMaterial,
    AmbientLight,
    DirectionalLight,
    Box,
    LambertMaterial,
    Camera,
    Renderer,
    Scene,
  },
  data: () => ({
    canvasWidth: "900",
    canvasHeight: "600",
    isShiftDown: false,
    createStructureMode: false,
    binObjects: [],
    storageBins: [],
    timer: null,
    onBinMoveFlag: false,
    onBinClickFlag: false,
    onBinCreateClickFlag: false,
    selectedBin: {
      name: "",
      boxes: [],
    },
    onMouseInteract: false,
    onMouseInteractTimer: null,
    viewLocation: false,
  }),

  mounted() {
    const plane = this.$refs.plane.mesh;
    const renderer = this.$refs.renderer;

    const gridHelper = new THREE.GridHelper(1000, 20);
    plane.add(gridHelper);

    if (!this.createStructureMode) {
      this.loadBins();

      renderer.onBeforeRender(() => {
        if (!this.onMouseInteract) {
          plane.rotation.y += 0.00075;
        }
      });
    }
  },

  methods: {
    onDrag({ transform }) {
      let target = this.$refs.target;
      target.style.transform = transform;
    },
    momentLocal(date) {
      return moment.utc(date).local().format("DD MMMM, YYYY");
    },
    currencyFormat(price) {
      return currencyFormat(price);
    },

    loadBins() {
      var _bins = [];
      const colLines = [0, 5, 6, 11, "backRow"];
      colLines.forEach((col, i) => {
        if (col === "backRow") {
          let bins = this.createRackWithBin({
            cols: 12,
            rows: 8,
            startingPoint: 12 * i + 1,
            x: -475,
            y: 25,
            z: -475,
            movingSide: "+x",
          });
          _bins = [..._bins, ...bins];
        } else {
          let bins = this.createRackWithBin({
            cols: 12,
            rows: 8,
            startingPoint: 12 * i + 1,
            x: -475 + 50 * col,
            y: 25,
            z: 325,
            movingSide: "-z",
          });
          _bins = [..._bins, ...bins];
        }
      });

      //this.binObjects = _bins;

      axios.get("Warehouses/DFLT/Sections/DFLT").then((response) => {
        if (response.data.data) {
          this.storageBins = response.data.data.reduce((result, bin) => {
            if (
              bin.warehouseName === "Default" &&
              bin.name.split("-").length > 2
            ) {
              let binGroup = bin.name.split("-").slice(0, -1).join("-");

              let _bin = result.find((x) => x.name === binGroup);
              if (_bin) {
                _bin.boxes.push(bin);
              } else {
                _bin = {};
                _bin.name = binGroup;
                _bin.boxes = [];
                _bin.boxes.push(bin);
              }

              result.push(_bin);
            }
            return result;
          }, []);

          this.storageBins.sort((a, b) => {
            return (
              this.intCompare(a.name.split("-")[0], b.name.split("-")[0]) ||
              this.intCompare(a.name.split("-")[1], b.name.split("-")[1]) ||
              this.compare(a, b)
            );
          });

          this.storageBins.forEach((x) => {
            let obj = _bins.find((y) => y.id === x.name);
            if (obj) {
              obj.data = x;
              this.binObjects.push(obj);
            }
          });
        }
      });
    },
    createRackWithBin(props) {
      //cols, rows, startingPoint, x, y, z, movingSide (Eg:+x|-z)
      let bins = [];
      for (let col = 0; col < props.cols; col++) {
        for (let row = 0; row < props.rows; row++) {
          let x = props.x,
            y = props.y,
            z = props.z;

          props.startingPoint = props.startingPoint || 0;

          if (props.movingSide == "+x") {
            x = props.x + 50 * col;
            y = props.y + 50 * row;
          } else if (props.movingSide == "-z") {
            z = props.z - 50 * col;
            y = props.y + 50 * row;
          }

          bins.push({
            position: { x, y, z },
            color: "#f7c802",
            defaultColor: "#f7c802",
            id: props.startingPoint + "-" + (props.rows - row),
          });
        }

        props.startingPoint++;
      }

      for (let row = 0; row < props.rows; row++) {
        let x = props.x,
          z = props.z;
        if (props.movingSide == "-z") {
          z = ((props.z + 25) / 50 - props.cols / 2) * 50;
        } else if (props.movingSide == "+x") {
          x = ((props.x + 25) / 50 + props.cols / 2) * 50 - 50;
        }
        this.getPlank({
          cols: props.cols,
          movingSide: props.movingSide,
          x: x,
          y: props.y - 25 + 50 * row,
          z: z,
        });
      }

      for (let col = 0; col < props.cols + 1; col++) {
        let x, z;
        if (props.movingSide == "+x") {
          x = props.x - 25 + 50 * col;
          z = props.z - 25;
        } else if (props.movingSide == "-z") {
          x = props.x - 25;
          z = props.z + 25 - 50 * col;
        }
        this.getVerticalLine({
          x,
          z,
          rows: props.rows,
        });
        this.getVerticalLine({
          x: props.movingSide == "-z" ? x + 50 : x,
          z: props.movingSide == "+x" ? z + 50 : z,
          rows: props.rows,
        });
      }

      return bins;
    },
    getPlank(props) {
      //cols, x, y, z
      let x = 50,
        z = 50;
      if (props.movingSide == "-z") {
        z = props.cols * 50;
      } else if (props.movingSide == "+x") {
        x = props.cols * 50;
      }

      const plane = this.$refs.plane;
      const geometry = new THREE.BoxGeometry(x, 1, z);
      const material = new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load(
          require("@/assets/images/plank-texture.png")
        ),
      });
      const plank = new THREE.Mesh(geometry, material);
      plank.position.copy({ x: props.x, y: props.y, z: props.z });
      plane.add(plank);
      return plank;
    },
    getVerticalLine(props) {
      //rows, x, z
      const plane = this.$refs.plane;
      const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
      const points = [];
      points.push(new THREE.Vector3(props.x, props.rows * 50, props.z));
      points.push(new THREE.Vector3(props.x, 0, props.z));
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, material);
      plane.add(line);
      return line;
    },
    getHorizontalLine(x, y) {
      const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
      const points = [];
      points.push(new THREE.Vector3(x, y, -250));
      points.push(new THREE.Vector3(x, y, 350));
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, material);
      return line;
    },
    intCompare(a, b) {
      if (parseInt(a) > parseInt(b)) return 1;
      if (parseInt(a) < parseInt(b)) return -1;
      return 0;
    },
    compare(a, b) {
      if (a < b) return 1;
      if (a > b) return -1;
      return 0;
    },
    onPointerOver(event) {
      this.onMouseInteract = event.over;
    },
    onPointerMove(event) {
      if (this.createStructureMode) {
        const intersect = event.intersect;
        const rollOver = this.$refs.rollOver;

        rollOver.mesh.position.copy(intersect.point).add(intersect.face.normal);
        rollOver.mesh.position
          .divideScalar(50)
          .floor()
          .multiplyScalar(50)
          .addScalar(25);
      }
    },
    onPointerClick(event) {
      if (!this.onBinCreateClickFlag) {
        const intersect = event.intersect;
        this.createBin(intersect);

        setTimeout(() => {
          this.onBinCreateClickFlag = false;
        }, 1000);

        this.onBinCreateClickFlag = true;
      }
    },
    onBinMove(event) {
      if (!this.onBinMoveFlag) {
        event.component.mesh.material.color.set(0xffffff);

        setTimeout(() => {
          this.onBinMoveFlag = false;
        }, 100);

        this.onBinMoveFlag = true;
      }
    },
    onBinLeave(event, bin) {
      event.component.mesh.material.color.set(bin.color);
    },
    onBinClicked(bin) {
      this.viewLocation = true;
      if (!this.onBinClickFlag) {
        if (bin && bin.id) {
          if (!bin.hasOwnProperty("data")) {
            bin.data = { name: bin.id, boxes: [] };
          }

          bin.data.boxes.forEach(async (box) => {
            if (!box.hasOwnProperty("products")) {
              let response = await axios.get("MemoryStocks/Bins/Products", {
                params: {
                  warehouse: box.warehouseAbbreviation,
                  section: box.sectionAbbreviation,
                  bin: box.abbreviation,
                },
              });
              box.products = response.data;
            }
          });

          this.selectedBin = Object.assign({}, bin.data);

          this.binObjects = this.binObjects.map((x) => {
            x.color = x.defaultColor;
            return x;
          });

          bin.color = "#fff";
        }

        setTimeout(() => {
          this.onBinClickFlag = false;
        }, 1000);

        this.onBinClickFlag = true;
      }
    },
    createBin(intersect) {
      const position = this.getPosition(intersect);
      const bin = { position };

      let binAbbr = prompt("Please enter the bin abbreviation");
      if (!!binAbbr) {
        bin.binAbbr = binAbbr;
        this.binObjects.push(bin);
        console.log("createBin", bin);
        return true;
      }

      return false;
    },
    getPosition(intersect) {
      const box = new THREE.Mesh();
      box.position.copy(intersect.point).add(intersect.face.normal);
      box.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
      return { x: box.position.x, y: box.position.y, z: box.position.z };
    },
    getStatusColor(id) {
      switch (id) {
        case 1:
          return "#f70762";
        case 2:
          return "#fe6609";
        case 3:
          return "#f7c802";
        case 4:
          return "#0db8fc";
        default:
          return "#f9a200";
      }
    },
  },
};
</script>

<style>
.sideView {
  position: fixed;
  top: 80px;
  bottom: 30px;
  right: 0;
  overflow-y: scroll;
  overflow-x: hidden;
  z-index: 100;
}
.sideHeadView {
  top: -10px;
  position: sticky;
  right: 0;
  z-index: 99999;
  background: #fff;
}
</style>