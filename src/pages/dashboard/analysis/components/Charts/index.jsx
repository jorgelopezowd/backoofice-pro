import numeral from 'numeral';
import Bar from './Bar';
import ChartCard from './ChartCard';
import Field from './Field';
import Gauge from './Gauge';
import MiniArea from './MiniArea';
import MiniBar from './MiniBar';
import MiniProgress from './MiniProgress';
import Pie from './Pie';
import TagCloud from './TagCloud';
import TimelineChart from './TimelineChart';
import WaterWave from './WaterWave';

const yuan = val => `¥ ${numeral(val).format('0,0')}`;
const cop = val => `$ ${numeral(val).format('0,0')}`;

const Charts = {
  yuan,
  cop,
  Bar,
  Pie,
  Gauge,
  MiniBar,
  MiniArea,
  MiniProgress,
  ChartCard,
  Field,
  WaterWave,
  TagCloud,
  TimelineChart,
};
export {
  Charts as default,
  yuan,
  cop,
  Bar,
  Pie,
  Gauge,
  MiniBar,
  MiniArea,
  MiniProgress,
  ChartCard,
  Field,
  WaterWave,
  TagCloud,
  TimelineChart,
};
