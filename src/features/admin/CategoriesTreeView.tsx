/* eslint-disable react/prop-types */
import { useState } from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { TreeView, TreeItem } from "@mui/lab";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function renderTree(nodes) {
	const handleEdit = () => null;
	const handleEditTag = () => null;
	return (
		<TreeItem
			key={nodes.name}
			nodeId={nodes.name}
			label={
				<div className="w-full flex justify-between">
					<span>{nodes.name}</span>
					{/* // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore */}
					<button onClick={() => handleEdit(nodes)}>Modifier</button>
				</div>
			}
		>
			{Array.isArray(nodes.subcategories)
				? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
				  // @ts-ignore
				  nodes.subcategories.map((node) => renderTree(node))
				: null}
			{nodes.tags && nodes.tags.length > 0 ? (
				<TreeItem
					key={`${nodes.name}-tags`}
					nodeId={`${nodes.name}-tags`}
					label="Tags"
				>
					{/* // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore */}
					{nodes.tags.map((tag) => (
						<TreeItem
							key={`${nodes.name}-${tag}`}
							nodeId={`${nodes.name}-${tag}`}
							label={
								<div className="flex justify-between">
									<span>{tag}</span>
									{/* // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore */}
									<button onClick={() => handleEditTag(nodes, tag)}>
										Modifier
									</button>
								</div>
							}
						/>
					))}
				</TreeItem>
			) : null}
		</TreeItem>
	);
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line react/prop-types
function CategoryTree({ data }) {
	// eslint-disable-next-line react/prop-types
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const [expanded, setExpanded] = useState([]);
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const handleToggle = (event, nodeIds) => {
		setExpanded(nodeIds);
	};

	return (
		<div>
			<TreeView
				defaultCollapseIcon={<ExpandMoreIcon />}
				defaultExpandIcon={<ChevronRightIcon />}
				expanded={expanded}
				onNodeToggle={handleToggle}
			>
				{/* // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore */}
				{/* // eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore */}
				{data.map((category) => renderTree(category))}
			</TreeView>
		</div>
	);
}

export default CategoryTree;
